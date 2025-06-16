<?php

namespace App\Filament\Resources\Blog;

use App\Filament\Resources\Blog\BlogCategoryResource\Pages;
use App\Filament\Resources\Blog\BlogCategoryResource\RelationManagers;
use App\Models\BlogCategory;
use Filament\Forms;
use Filament\Forms\Components\Tabs\Tab;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class BlogCategoryResource extends Resource
{
    protected static ?string $model = BlogCategory::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder';
    protected static ?string $slug = 'blog/categories';
    protected static ?string $navigationGroup = 'Blog';
    protected static ?int $navigationSort = 1;
    protected static ?string $recordTitleAttribute = 'name';
    protected static ?string $navigationLabel = 'Catégories';
    protected static ?string $pluralLabel = 'Categories de Blog';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Information Multilingues')
                    ->description('Contenu traduit dans différentes langues')
                    ->schema([
                        Forms\Components\Tabs::make('Langues')
                            ->schema([
                                Tab::make('Francais')
                                    ->icon('heroicon-m-flag')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.fr')
                                            ->label('Nom (Francais)')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn(Forms\Set $set, ?string $state, string $context) => $context === 'create' ? $set('slug.fr', Str::slug($state)) : null)
                                            ->placeholder('ex: Actualités Tech'),

                                        Forms\Components\TextInput::make('slug.fr')
                                            ->label('Slug (Francais)')
                                            ->required()
                                            ->rules(['alpha-dash'])
                                            ->maxLength(255)
                                            ->helperText('Utilisé dans les URLs - généré automatiquement')
                                            ->placeholder('ex: actualités-tech'),

                                        Forms\Components\RichEditor::make('description.fr')
                                            ->label('Description (Francais)')
                                            ->placeholder('Description de la catégorie en français...'),
                                    ]),

                                Tab::make('Anglais')
                                    ->icon('heroicon-m-flag')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.en')
                                            ->label('Name (English)')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn(Forms\Set $set, ?string $state, string $context) => $context === 'create' ? $set('slug.en', Str::slug($state)) : null)
                                            ->placeholder('ex: Tech News'),

                                        Forms\Components\TextInput::make('slug.en')
                                            ->label('Slug (English)')
                                            ->required()
                                            ->rules(['alpha-dash'])
                                            ->maxLength(255)
                                            ->helperText('Used on urls - generated automatic')
                                            ->placeholder('ex: tech-news'),

                                        Forms\Components\RichEditor::make('description.en')
                                            ->label('Description (English)')
                                            ->placeholder('Description in English'),
                                    ])
                            ])
                            ->columnSpanFull()
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-language'),

                Forms\Components\Section::make('Configuration')
                    ->description('Paramètres d\'affichage et organisation')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\Select::make('icon')
                                    ->label('Icône')
                                    ->options([
                                        'heroicon-o-newspaper' => '📰 Journal',
                                        'heroicon-o-computer-desktop' => '💻 Tech',
                                        'heroicon-o-briefcase' => '💼 Business',
                                        'heroicon-o-academic-cap' => '🎓 Éducation',
                                        'heroicon-o-heart' => '❤️ Lifestyle',
                                        'heroicon-o-camera' => '📷 Photo',
                                        'heroicon-o-music-note' => '🎵 Musique',
                                        'heroicon-o-globe-europe-africa' => '🌍 Voyage',
                                        'heroicon-o-beaker' => '🧪 Science',
                                        'heroicon-o-trophy' => '🏆 Sport',
                                    ])
                                    ->searchable()
                                    ->placeholder('Sélectionner une icône'),

                                Forms\Components\ColorPicker::make('color')
                                    ->label('Couleur')
                                    ->default('#3B82F6'),

                                Forms\Components\TextInput::make('sort_order')
                                    ->label('Ordre d\'affichage')
                                    ->numeric()
                                    ->default(0)
                                    ->helperText('Plus petit = affiché en premier')
                            ]),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Catégorie Active')
                            ->helperText('Activer/Desactiver cette Catégorie')
                            ->default(true)
                            ->inline(false),
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
                Tables\Columns\IconColumn::make('icon')
                    ->size(Tables\Columns\IconColumn\IconColumnSize::Medium),

                Tables\Columns\TextColumn::make('name')
                    ->label('Nom')
                    ->searchable()
                    ->weight(FontWeight::Medium)
                    ->formatStateUsing(fn(BlogCategory $record): string => $record->getTranslation('name', app()->getLocale()) ?? $record->getTranslation('name', 'fr'))
                    ->description(function (BlogCategory $record): ?string {
                        $description = $record->getTranslation('description', app()->getLocale());
                        return $description ? Str::limit($description, 50) : null;
                    }),

                Tables\Columns\ColorColumn::make('color')
                    ->label('couleur'),

                Tables\Columns\TextColumn::make('is_active')
                    ->label('Statut')
                    ->badge()
                    ->colors([
                        'success' => true,
                        'danger' => false
                    ])
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Active' : 'Inactive')
                    ->sortable(),
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
                    ->label('Statut')
                    ->placeholder('Toutes')
                    ->trueLabel('Active seulement')
                    ->falseLabel('Inactive seulement'),

            ])
            ->actions([
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
            'index' => Pages\ListBlogCategories::route('/'),
            'create' => Pages\CreateBlogCategory::route('/create'),
            'edit' => Pages\EditBlogCategory::route('/{record}/edit'),
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

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'redacteur', 'gestionnaire']);
    }
}
