<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TemplateResource\Pages;
use App\Filament\Resources\TemplateResource\RelationManagers;
use App\Models\Template;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TemplateResource extends Resource
{
    protected static ?string $model = Template::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Gestion des produits';
    protected static ?int $navigationSort = 3;
    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Informations de base')
                    ->description('Détails essentiels du template')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('pack_id')
                                    ->label('Pack associé')
                                    ->relationship('pack', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->placeholder('Sélectionner un pack')
                                    ->columnSpanFull(),

                                TextInput::make('name')
                                    ->label('Nom du Template')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('ex: Carte de visite moderne'),

                                Toggle::make('is_active')
                                    ->label('Template Actif')
                                    ->helperText('Activer/désactiver ce template')
                                    ->default(true)
                                    ->inline(false),
                            ]),

                        Textarea::make('description')
                            ->label('Description')
                            ->maxLength(1000)
                            ->rows(3)
                            ->placeholder('Description du template...')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-information-circle'),

                Section::make('Fichiers du Template')
                    ->description('Images et fichiers de conception')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                FileUpload::make('recto_path')
                                    ->label('Recto (Face avant)')
                                    ->image()
                                    ->imageEditor()
                                    ->directory('templates/recto')
                                    ->visibility('private')
                                    ->maxSize(5120)
                                    ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
                                    ->helperText('Image du recto (max 5MB)'),

                                FileUpload::make('verso_path')
                                    ->label('Verso (Face arrière)')
                                    ->image()
                                    ->imageEditor()
                                    ->directory('templates/verso')
                                    ->visibility('private')
                                    ->maxSize(5120)
                                    ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
                                    ->helperText('Image du verso (max 5MB)'),
                            ]),

                        FileUpload::make('preview_path')
                            ->label('Image de Prévisualisation')
                            ->image()
                            ->imageEditor()
                            ->directory('templates/previews')
                            ->visibility('public')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
                            ->helperText('Image d\'aperçu public (max 5MB)')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-photo'),

                Section::make('Métadonnées')
                    ->description('Tags et informations supplémentaires')
                    ->schema([
                        TagsInput::make('tags')
                            ->label('Tags')
                            ->separator(',')
                            ->placeholder('Ajouter des tags...')
                            ->helperText('Appuyez sur Entrée ou virgule pour ajouter des tags')
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-tag'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('preview_path')
                    ->label('Aperçu')
                    ->disk('public')
                    ->circular()
                    ->size(50)
                    ->defaultImageUrl(asset('images/template-placeholder.png')),

                TextColumn::make('name')
                    ->label('Nom du template')
                    ->searchable()
                    ->weight(FontWeight::Medium)
                    ->description(fn(Template $record): ?string => $record->description ? \Illuminate\Support\Str::limit($record->description, 30) : null),

                BadgeColumn::make('pack.name')
                    ->label('Pack')
                    ->searchable()
                    ->color('primary'),

                BadgeColumn::make('pack.type')
                    ->label('Type de Pack')
                    ->colors([
                        'primary' => 'standard',
                        'success' => 'pro',
                        'warning' => 'sur_mesure'
                    ])
                    ->formatStateUsing(fn(?string $state): string => match ($state) {
                        'standard' => 'Standard',
                        'pro' => 'Pro',
                        'sur_mesure' => 'Sur mesure',
                        default => $state ?? 'N/A'
                    }),

                BadgeColumn::make('is_active')
                    ->label('Statut')
                    ->colors([
                        'success' => true,
                        'danger' => false
                    ])
                    ->formatStateUsing(fn(bool $state): string => $state ? 'Actif' : 'Inactif')
                    ->sortable(),

                TextColumn::make('orders_count')
                    ->label('Commandes')
                    ->counts('orders')
                    ->sortable()
                    ->alignCenter()
                    ->color('primary'),

                IconColumn::make('recto_path')
                    ->label('Recto')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->getStateUsing(fn(Template $record): bool => !empty($record->recto_path)),

                IconColumn::make('verso_path')
                    ->label('Verso')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->getStateUsing(fn(Template $record): bool => !empty($record->verso_path)),

                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListTemplates::route('/'),
            'create' => Pages\CreateTemplate::route('/create'),
            'view' => Pages\ViewTemplate::route('/{record}'),
            'edit' => Pages\EditTemplate::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
