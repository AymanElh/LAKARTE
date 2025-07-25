<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackResource\Pages;
use App\Filament\Resources\PackResource\RelationManagers;
use App\Models\Pack;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class PackResource extends Resource
{
    protected static ?string $model = Pack::class;
    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static ?string $navigationGroup = 'Gestion des produits';
    protected static ?int $navigationSort = 1;
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $navigationLabel = 'Packs';
    protected static ?string $pluralModelLabel = 'Packs';



    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Informations de base')
                    ->description('Détails essentiels du pack et tarification')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->label('Nom du Pack')
                                    ->required()
                                    ->placeholder('ex: Cartes de Visite Standard')
                                    ->maxLength(100)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn(Forms\Set $set, ?string $state, string $context) => $context === 'create' ? $set('slug', Str::slug($state)) : null),
                                TextInput::make('slug')
                                    ->label('Slug URL')
                                    ->unique(Pack::class, 'slug', ignoreRecord: true)
                                    ->rules(['alpha-dash'])
                                    ->helperText('Utilisé dans les URLs - généré automatiquement')
                                    ->maxLength(100),
                                Select::make('type')
                                    ->label('Type de Pack')
                                    ->options([
                                        'standard' => 'Standard',
                                        'pro' => 'Pro',
                                        'sur_mesure' => 'Sur Mesure',
                                    ])
                                    ->required()
                                    ->native(false)
                                    ->placeholder('Sélectionner le type'),
                                TextInput::make('price')
                                    ->label('Prix (MAD)')
                                    ->required()
                                    ->numeric()
                                    ->minValue(0)
                                    ->step(0.01)
                                    ->prefix('DH')
                                    ->placeholder('0.00'),
                                TextInput::make('delivery_time_days')
                                    ->label('Délai de Livraison ')
                                    ->required()
                                    ->numeric()
                                    ->minValue(1)
                                    ->maxValue(365)
                                    ->suffix('jours')
                                    ->placeholder('e.g., 3')
                            ]),
                        Textarea::make('description')
                            ->label('Description')
                            ->required()
                            ->maxLength(1000)
                            ->rows(4)
                            ->placeholder('Describe what\'s included on this pack ...')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-information-circle'),

                Section::make('Caractéristiques du Pack')
                    ->description('Définir ce qui est inclus dans ce pack')
                    ->schema([
                        Repeater::make('features')
                            ->label('Liste des Caractéristiques')
                            ->schema([
                                TextInput::make('feature')
                                    ->label('Caracteristique')
                                    ->required()
                                    ->maxLength('100')
                                    ->placeholder('ex: Impression haute qualite'),
                            ])
                            ->addActionLabel('Ajouter une Caractéristique')
                            ->defaultItems(1)
                            ->collapsible()
                            ->columnSpanFull()
                            ->itemLabel(fn(array $state): ?string => $state['feature'] ?? null)
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-list-bullet'),

                Section::make('Visuels et Media')
                    ->description('Image et representation visuel du pack')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Image du pack')
                            ->image()
                            ->imageEditor()
                            ->directory('packs/images')
                            ->visibility('public')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg'])
                            ->helperText('Télécharger l\'image du pack (max 5MB, recommandé: 800x600px)')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-photo'),

                Section::make('Status et visibilite')
                    ->description('Statut du pack et paramètres de mise en avant')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Toggle::make('is_active')
                                    ->label('Pack Actif')
                                    ->helperText('Activer/desactiver ce pack')
                                    ->default(true)
                                    ->inline(false),
                                Toggle::make('highlight')
                                    ->label('Mettre en avant')
                                    ->helperText('Afficher ce pack en vedette')
                                    ->default(false)
                                    ->inline(false)
                            ])
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-cog-6-tooth')
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_path')
                    ->label('Image')
                    ->circular()
                    ->size(40)
                    ->getStateUsing(fn($record) => asset('storage/' . $record->image_path)),

                TextColumn::make('name')
                    ->label('Nom du pack')
                    ->searchable()
                    ->weight(FontWeight::Medium)
                    ->description(fn(Pack $record): string => Str::limit($record->description, 20)),

                BadgeColumn::make('type')
                    ->label('Type')
                    ->colors([
                        'primary' => 'standard',
                        'success' => 'pro',
                        'warning' => 'sur_mesure'
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'standard' => 'Standard',
                        'pro' => 'Pro',
                        'sur_mesure' => 'Sur mesure',
                        default => $state
                    })
                    ->sortable(),

                TextColumn::make('price')
                    ->label('Prix')
                    ->money('MAD')
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->color('success'),

                TextColumn::make('delivery_time_days')
                    ->label('Delai')
                    ->suffix(' jours')
                    ->sortable()
                    ->alignCenter()
                    ->color('info'),

                BadgeColumn::make('is_active')
                    ->label('Statut')
                    ->colors([
                        'success' => true,
                        'danger' => false
                    ])
                    ->formatStateUsing(fn(bool $state): string => $state ? 'Active' : 'Inactif')
                    ->sortable(),

                IconColumn::make('highlight')
                    ->label('En vedette')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->sortable(),

                TextColumn::make('orders_count')
                    ->label('Commandes')
                    ->counts('orders')
                    ->sortable()
                    ->alignCenter()
                    ->color('primary'),

                TextColumn::make('templates_count')
                    ->label('Templates')
                    ->counts('templates')
                    ->sortable()
                    ->alignCenter()
                    ->color('info'),

                TextColumn::make('pack_offers_count')
                    ->label('Offres')
                    ->counts('packOffers')
                    ->sortable()
                    ->alignCenter()
                    ->color('warning'),

                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Statut du pack')
                    ->placeholder('Tous les packs')
                    ->trueLabel('Actif seulement')
                    ->falseLabel('Inactif seulement'),

                Tables\Filters\TernaryFilter::make('highlight')
                    ->label('Pack en vedette')
                    ->placeholder('Tous les packs')
                    ->trueLabel('En vedette seulement')
                    ->falseLabel('Normaux seulement'),

                Tables\Filters\TernaryFilter::make('price_range')
                    ->label('Fourchette de prix')
                    ->form([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('price_from')
                                    ->label('Prix minimum')
                                    ->numeric()
                                    ->prefix('DH'),
                                TextInput::make('price_to')
                                    ->label('Prix maximum')
                                    ->numeric()
                                    ->prefix('DH')

                            ])
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['price_from'],
                                fn(Builder $query, $price): Builder => $query->where('price', '>=', $price),
                            )
                            ->when(
                                $data['price_to'],
                                fn(Builder $query, $price): Builder => $query->where('price', '<=', $price),
                            );
                    })
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label('')
                    ->tooltip('Modifier ce pack'),
                Tables\Actions\DeleteAction::make()
                    ->label('')
                    ->tooltip('Supprimer ce pack')
                    ->successNotification(
                        Notification::make()
                            ->title('Pack supprimé')
                            ->body('Le pack a été déplacé dans les éléments supprimés.')
                            ->success()
                    ),

                Tables\Actions\RestoreAction::make()
                    ->label('')
                    ->icon('heroicon-o-arrow-path')
                    ->tooltip('Restaurer')
                    ->color('success')
                    ->visible(fn ($record) => !is_null($record->deleted_at))
                    ->successNotification(
                        Notification::make()
                            ->title('Pack restauré')
                            ->body('Le Pack a ete restauré avec success')
                            ->success()
                    ),

                Tables\Actions\ForceDeleteAction::make()
                    ->label('')
                    ->icon('heroicon-o-trash')
                    ->tooltip('Supprimer Définitivement')
                    ->color('danger')
                    ->visible(fn ($record) => !is_null($record->deleted_at)),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->label('Supprimer Sélectionnés'),

                    Tables\Actions\ForceDeleteBulkAction::make()
                        ->label('Supprimer Définitivement'),

                    Tables\Actions\RestoreBulkAction::make()
                        ->label('Restaurer Sélectionnés'),



                ]),
            ])
            ->defaultSort('created_at', 'asc')
            ->striped()
            ->paginated([10, 25, 50])
            ->recordClasses(fn() => 'py-10');
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
            'index' => Pages\ListPacks::route('/'),
            'create' => Pages\CreatePack::route('/create'),
            'edit' => Pages\EditPack::route('/{record}/edit'),
            'view' => Pages\ViewPack::route('/{record}')
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class
            ])
            ->withCount(['orders', 'templates', 'packOffers']);
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'success';
    }

    public static function canGloballySearch(): bool
    {
        return true;
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'slug', 'price'];
    }

    public static function getGlobalSearchResultTitle(Model|\Illuminate\Database\Eloquent\Model $record): string
    {
        return $record->name;
    }

    public static function getGlobalSearchResultDetails(Model|\Illuminate\Database\Eloquent\Model $record): array
    {
        return [
            'Slug' => $record->slug,
            'Type' => ucfirst($record->type),
            'Price' => $record->price
        ];
    }

}
