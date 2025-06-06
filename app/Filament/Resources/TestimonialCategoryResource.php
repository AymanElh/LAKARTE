<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialCategoryResource\Pages;
use App\Filament\Resources\TestimonialCategoryResource\RelationManagers;
use App\Models\TestimonialCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn\IconColumnSize;
use Filament\Tables\Table;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class TestimonialCategoryResource extends Resource
{
    protected static ?string $model = TestimonialCategory::class;
    protected static ?string $navigationIcon = 'heroicon-o-folder-open';
    protected static ?string $navigationGroup = 'Témoignages et Galeries';
    protected static ?int $navigationSort = 1;
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $navigationLabel = 'Categories';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informations de base')
                    ->description('Détails de la catégorie de témoignages')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->label('Nom de la categorie')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn(Forms\Set $set, ?string $state, string $context) => $context === 'create' ? $set('slug', Str::slug($state)) : null),

                                Forms\Components\TextInput::make('slug')
                                    ->label('Slug Url')
                                    ->unique(TestimonialCategory::class, 'slug', ignoreRecord: true)
                                    ->rules(['alpha-dash'])
                                    ->helperText('Utilisé dans les URLs - généré automatiquement')
                                    ->maxLength(255),

                                Forms\Components\Select::make('icon')
                                    ->label('Icone')
                                    ->options([
                                        'heroicon-o-star' => '⭐ Étoile',
                                        'heroicon-o-heart' => '❤️ Cœur',
                                        'heroicon-o-camera' => '📷 Caméra',
                                        'heroicon-o-video-camera' => '🎥 Vidéo',
                                        'heroicon-o-chat-bubble-left-ellipsis' => '💬 Chat',
                                        'heroicon-o-megaphone' => '📢 Mégaphone',
                                        'heroicon-o-user-group' => '👥 Groupe',
                                        'heroicon-o-trophy' => '🏆 Trophée',
                                    ])
                                    ->searchable()
                                    ->placeholder('Sélectionner une icône'),

                                Forms\Components\ColorPicker::make('color')
                                    ->label('Couleur')
                                    ->default('#3B82F6')
                                    ->helperText('Couleur d\'affichage de la categorie'),

                                Forms\Components\TextInput::make('sort_order')
                                    ->label('Order d\'affichage')
                                    ->numeric()
                                    ->default(0)
                                    ->helperText('Plus le nombre est petit, plus la catégorie apparaît en premier'),

                                Forms\Components\Toggle::make('is_active')
                                    ->label('Catégorie Active')
                                    ->helperText('Activer/désactiver cette catégorie')
                                    ->default(true)
                                    ->inline(false),
                            ]),

                        Forms\Components\Textarea::make('description')
                            ->label('Description')
                            ->maxLength(5000)
                            ->rows(3)
                            ->placeholder('Description de la catégorie...')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-information-circle')
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\IconColumn::make('icon')
                    ->label('Icon')
                    ->size(IconColumnSize::Medium),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->weight(FontWeight::Medium)
                    ->description(fn(TestimonialCategory $record): string => $record->description ? Str::limit($record->description, 50) : null),

                Tables\Columns\ColorColumn::make('color')
                    ->label('Couleur'),

                Tables\Columns\BadgeColumn::make('is_active')
                    ->label('Statut')
                    ->colors([
                        'success' => true,
                        'danger' => false
                    ])
                    ->formatStateUsing(fn(bool $state) => $state ? 'Active' : 'Inactive')
                    ->sortable(),

                Tables\Columns\TextColumn::make('testimonials_count')
                    ->label('Témoignages')
                    ->counts('testimonials')
                    ->sortable()
                    ->alignCenter()
                    ->color('primary'),

                Tables\Columns\TextColumn::make('published_testimonials_count')
                    ->label('Publiés')
                    ->counts('publishedTestimonials')
                    ->sortable()
                    ->alignCenter('center')
                    ->color('success'),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Ordre')
                    ->sortable()
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Statut de la catégorie')
                    ->placeholder('Toutes les catégories')
                    ->trueLabel('Active seulement')
                    ->falseLabel('Inactive seulement'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->successNotification(
                        Notification::make()
                            ->title('Catégorie supprimée')
                            ->body('La catégorie a été supprimée avec succès.')
                            ->success()
                    )
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->label('Supprimer Sélectionnés'),
                ]),
            ])
            ->defaultSort('sort_order', 'asc')
            ->striped()
            ->paginated([10, 25, 50]);
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
            'index' => Pages\ListTestimonialCategories::route('/'),
            'create' => Pages\CreateTestimonialCategory::route('/create'),
            'view' => Pages\ViewTestimonialCategory::route('/{record}'),
            'edit' => Pages\EditTestimonialCategory::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'info';
    }

    public static function canGloballySearch(): bool
    {
        return true;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'description'];
    }

    public static function getGlobalSearchResultTitle(Model $record): string|Htmlable
    {
        return $record->name;
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Description' => $record->description,
            'Témoignages' => $record->testimoniales_count ?? 0
        ];
    }
}
