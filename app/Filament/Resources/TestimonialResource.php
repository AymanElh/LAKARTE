<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Filament\Resources\TestimonialResource\RelationManagers;
use App\Models\Testimonial;
use Filament\Actions\Action;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationGroup = 'Témoignages et Galeries';
    protected static ?int $navigationSort = 2;
    protected static ?string $recordTitleAttribute = 'client_name';
    protected static ?string $navigationLabel = 'Témoignages';
    protected static ?string $pluralLabel = 'Témoignages';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informations du base')
                    ->description('Détails du client qui a laissé le témoignage')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\TextInput::make('client_name')
                                    ->label('Nom du client')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Nom complet du client'),

                                Forms\Components\TextInput::make('client_title')
                                    ->label('Titre/Poste')
                                    ->maxLength(255)
                                    ->placeholder('ex. Directeur Marketing'),

                                Forms\Components\TextInput::make('client_company')
                                    ->label('Entreprise')
                                    ->maxLength(255)
                                    ->placeholder('Nom de l\'entreprise'),
                            ])
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-user'),

                Forms\Components\Section::make('Contenu du témoignage')
                    ->description('Le témoignage et ses détails')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('category_id')
                                    ->label('Categorie')
                                    ->required()
                                    ->relationship('category', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->placeholder('Sélectionner une catégorie'),

                                Forms\Components\Select::make('type')
                                    ->label('Type de témoignage')
                                    ->options([
                                        'text' => '📝 Texte seulement',
                                        'image' => '📷 Avec image',
                                        'video' => '🎥 Avec vidéo',
                                    ])
                                    ->default('text')
                                    ->required()
                                    ->native(false)
                                    ->live(),

                                Forms\Components\Select::make('rating')
                                    ->label('Note (étoiles)')
                                    ->options([
                                        1 => '⭐ (1/5)',
                                        2 => '⭐⭐ (2/5)',
                                        3 => '⭐⭐⭐ (3/5)',
                                        4 => '⭐⭐⭐⭐ (4/5)',
                                        5 => '⭐⭐⭐⭐⭐ (5/5)',
                                    ])
                                    ->placeholder('Sélectionner une note'),

                                Forms\Components\TextInput::make('source')
                                    ->label('Source')
                                    ->maxLength(255)
                                    ->placeholder('ex: Google, Facebook, Direct'),
                            ]),

                        Forms\Components\RichEditor::make('content')
                            ->label('Contenu de temoinages')
                            ->required()
                            ->placeholder('Le témoignage complet du client...')
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'bulletList',
                                'orderList',
                                'link'
                            ]),

                        Forms\Components\TextInput::make('source_url')
                            ->label('URL de la source')
                            ->url()
                            ->placeholder('https://...')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-chat-bubble-left-ellipsis'),

                Forms\Components\Section::make('media')
                    ->description('Images ou vidéos associées au témoignage')
                    ->schema([
                        Forms\Components\FileUpload::make('media_path')
                            ->label(fn(Forms\Get $get): string => match ($get('type')) {
                                'image' => 'Image de témoignage',
                                'video' => 'Video de témoignage',
                                default => 'Media'
                            })
                            ->directory('testimonials/media')
                            ->visibility('public')
                            ->maxSize(fn(Forms\Get $get): int => $get('type') === 'video' ? '51200' : '5120')
                            ->acceptedFileTypes(fn(Forms\Get $get): array => match ($get('type')) {
                                'image' => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg'],
                                'video' => ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
                                default => []
                            })
                            ->visible(fn(Forms\Get $get): bool => in_array($get('type'), ['image', 'video']))
                            ->columnSpan(1),

                        Forms\Components\FileUpload::make('thumbnail_path')
                            ->label('Miniature (pour vidéo)')
                            ->image()
                            ->directory('testimonials/thumbnails')
                            ->visibility('public')
                            ->maxSize(2048)
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg'])
                            ->visible(fn(Forms\Get $get): bool => $get('type') === 'video')
                            ->columnSpan(1)
                    ])
                    ->columns(3)
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-photo'),

                Forms\Components\Section::make('Paramètres et métadonnées')
                    ->description('Configuration d\'affichage et informations supplémentaires')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\Toggle::make('is_published')
                                    ->label('Publié')
                                    ->helperText('Afficher ce témoignage publiquement')
                                    ->default(false)
                                    ->inline(false),

                                Forms\Components\Toggle::make('is_featured')
                                    ->label('En vedette')
                                    ->helperText('Mettre en avant ce témoignage')
                                    ->default(false)
                                    ->inline(false),

                                Forms\Components\TextInput::make('sort_order')
                                    ->label('Ordre d\'affichage')
                                    ->numeric()
                                    ->default(0)
                                    ->helperText('Plus petit = affiché en premier'),
                            ]),

                        Forms\Components\DateTimePicker::make('review_date')
                            ->label('Date du témoignage')
                            ->default(now())
                            ->columnSpan(2),

                        Forms\Components\Repeater::make('metadata')
                            ->label('Métadonnées supplémentaires')
                            ->schema([
                                Forms\Components\TextInput::make('key')
                                    ->label('Clé')
                                    ->required()
                                    ->placeholder('ex: google_review_id'),

                                Forms\Components\TextInput::make('value')
                                    ->label('Valeur')
                                    ->required()
                                    ->placeholder('Valeur correspondante'),
                            ])
                            ->collapsible()
                            ->itemLabel(fn(array $state): ?string => $state['key'] ?? null)
                            ->addActionLabel('Ajouter une métadonnée')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-cog-6-tooth'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('media_path')
                    ->label('Media')
                    ->circular()
                    ->size(40)
                    ->getStateUsing(fn($record) => asset('storage/' . $record->media_path))
                    ->visible(fn($record): bool => $record?->type !== 'text'),

                Tables\Columns\TextColumn::make('client_name')
                    ->label('Client')
                    ->searchable()
                    ->weight(FontWeight::Medium)
                    ->description(fn(Testimonial $record): ?string => $record->client_full_name),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Catégorie')
                    ->searchable()
                    ->color(fn($record): string => $record->category->color ?? 'warning'),

                Tables\Columns\BadgeColumn::make('type')
                    ->colors([
                        'gray' => 'text',
                        'info' => 'image',
                        'purple' => 'video'
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'text' => '📝 Texte',
                        'image' => '📷 Image',
                        'video' => '🎥 Vidéo',
                        default => $state
                    }),

                Tables\Columns\TextColumn::make('rating')
                    ->label('Note')
                    ->formatStateUsing(fn(?int $state): string => $state ? str_repeat('⭐', $state) : 'Non noté')
                    ->sortable(),

                Tables\Columns\TextColumn::make('source')
                    ->badge()
                    ->color('info')
                    ->placeholder('Direct'),

                Tables\Columns\BadgeColumn::make('is_published')
                    ->label('Statut')
                    ->colors([
                        'success' => true,
                        'warning' => false
                    ])
                    ->formatStateUsing(fn(string $state): string => $state ? 'Publié' : 'Brouillon'),

                Tables\Columns\BadgeColumn::make('is_featured')
                    ->label('Vedette')
                    ->colors([
                        'warning' => true,
                        'gray' => false
                    ])
                    ->formatStateUsing(fn(string $state): string => $state ? '⭐ Oui' : 'Non'),

                Tables\Columns\TextColumn::make('content')
                    ->label('Extrait')
                    ->limit(50)
                    ->html()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('review_date')
                    ->label('Date témoignage')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Catégorie')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'text' => 'Texte seulement',
                        'image' => 'Avec image',
                        'video' => 'Avec vidéo',
                    ]),

                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Statut de publication')
                    ->placeholder('Tous')
                    ->trueLabel('Publié seulement')
                    ->falseLabel('Brouillons seulement'),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('En vedette')
                    ->placeholder('Tous')
                    ->trueLabel('En vedette seulement')
                    ->falseLabel('Normaux seulement'),

                Tables\Filters\SelectFilter::make('rating')
                    ->label('Note')
                    ->options([
                        5 => '⭐⭐⭐⭐⭐ (5/5)',
                        4 => '⭐⭐⭐⭐ (4/5)',
                        3 => '⭐⭐⭐ (3/5)',
                        2 => '⭐⭐ (2/5)',
                        1 => '⭐ (1/5)',
                    ]),

                Tables\Filters\Filter::make('review_date')
                    ->label('Période')
                    ->form([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\DatePicker::make('review_from')
                                    ->label('Du'),
                                Forms\Components\DatePicker::make('review_until')
                                    ->label('Au'),
                            ])
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['review_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('review_date', '>=', $date),
                            )
                            ->when(
                                $data['review_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('review_date', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('toggle_published')
                    ->label(fn(Testimonial $record): string => $record->is_published ? 'Dépublier' : 'Publier')
                    ->icon(fn(Testimonial $record): string => $record->is_published ? 'heroicon-o-eye-slash' : 'heroicon-o-eye')
                    ->color(fn(Testimonial $record): string => $record->is_published ? 'warning' : 'success')
                    ->action(function (Testimonial $record): void {
                        $record->update(['is_published' => !$record->is_published]);
                        Notification::make()
                            ->title('Statut mis à jour')
                            ->body('Le témoignage a été ' . ($record->is_published ? 'publié' : 'dépublié'))
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('toggle_featured')
                    ->label('')
                    ->icon('heroicon-o-star')
                    ->color(fn(Testimonial $record): string => $record->is_featured ? 'warning' : 'gray')
                    ->tooltip(fn(Testimonial $record): string => $record->is_featured ? 'Retirer de la vedette' : 'Mettre en vedette')
                    ->action(function (Testimonial $record): void {
                        $record->update(['is_featured' => !$record->is_featured]);

                        Notification::make()
                            ->title('Vedette mise à jour')
                            ->body('Le témoignage a été ' . ($record->is_featured ? 'mis en vedette' : 'retiré de la vedette'))
                            ->success()
                            ->send();
                    }),

                Tables\Actions\ViewAction::make()
                    ->label('')
                    ->tooltip('Voir ce témoignage'),
                Tables\Actions\EditAction::make()
                    ->label('')
                    ->tooltip('Modifier ce témoignage'),
                Tables\Actions\DeleteAction::make()
                    ->label('')
                    ->tooltip('Supprimer ce témoignage')
                    ->successNotification(
                        Notification::make()
                            ->title('Témoignage supprimé')
                            ->body('Le témoignage a été supprimé avec succès.')
                            ->success()
                    ),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'view' => Pages\ViewTestimonial::route('/{record}'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_published', false)->count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'getionnaire']);
    }

    public static function canGloballySearch(): bool
    {
        return true;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['client_name', 'client_company', 'content'];
    }

    public static function getGlobalSearchResultTitle(Model $record): string|Htmlable
    {
        return 'Témoignage de ' . $record->client_name;
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Catégorie' => $record->category?->name,
            'Type' => match ($record->type) {
                'text' => 'Texte',
                'image' => 'Image',
                'video' => 'Vidéo',
                default => $record->type
            },
            'Statut' => $record->is_published ? 'Publié' : 'Brouillon',
        ];
    }
}
