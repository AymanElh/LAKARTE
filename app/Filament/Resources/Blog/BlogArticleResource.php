<?php

namespace App\Filament\Resources\Blog;

use App\Filament\Resources\Blog\BlogArticleResource\Pages;
use App\Filament\Resources\Blog\BlogArticleResource\RelationManagers;
use App\Models\BlogArticle;
use App\Models\BlogCategory;
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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogArticleResource extends Resource
{
    protected static ?string $model = BlogArticle::class;
    protected static ?string $slug = 'blog/articles';
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationGroup = 'Blog';
    protected static ?int $navigationSort = 2;
    protected static ?string $recordTitleAttribute = 'title';
    protected static ?string $navigationLabel = 'Articles';
    protected static ?string $pluralLabel = 'Articles de Blog';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informations de base')
                    ->description('Catégorie, auteur et paramètres de publication')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\Select::make('category_id')
                                    ->relationship('category', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->placeholder('Sélectionner une catégorie')
                                    ->getOptionLabelFromRecordUsing(fn(BlogCategory $record): string => $record->getTranslation('name', app()->getLocale()) ?? $record->getTranslation('name', 'fr')),

                                Forms\Components\Select::make('author_id')
                                    ->label('Auteur')
                                    ->relationship('author', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->default(auth()->id())
                                    ->placeholder('Sélectionner un auteur'),

                                Forms\Components\Select::make('status')
                                    ->label('Statut')
                                    ->options([
                                        'draft' => '📝 Brouillon',
                                        'published' => '✅ Publié',
                                        'scheduled' => '⏰ Planifié',
                                    ])
                                    ->default('draft')
                                    ->required()
                                    ->native(false)
                                    ->live(),
                            ]),

                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\DateTimePicker::make('published_at')
                                    ->label('Date de publication')
                                    ->visible(fn(Forms\Get $get): bool => $get('status') === 'published')
                                    ->default(now()),

                                Forms\Components\DateTimePicker::make('scheduled_at')
                                    ->label('Date de Planification')
                                    ->visible(fn(Forms\Get $get): bool => $get('status') === 'scheduled')
                                    ->required(fn(Forms\Get $get): bool => $get('status') === 'shceduled')
                                    ->minDate(now()),
                            ]),

                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\Toggle::make('is_featured')
                                    ->label('Article en vedette')
                                    ->helperText('Mettre en avant cet article')
                                    ->default(false)
                                    ->inline(false),

                                Forms\Components\Toggle::make('allow_comments')
                                    ->label('Autoriser les commentaires')
                                    ->default(true)
                                    ->inline(false),

                                Forms\Components\TextInput::make('sort_order')
                                    ->label('Ordre d\'affichage')
                                    ->numeric()
                                    ->default(0)
                                    ->helperText('Plus petit = affiché en premier'),
                            ]),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-information-circle'),

                Forms\Components\Section::make('Contenue Multilingue')
                    ->description('Titre, contenu et SEO dans différentes langues')
                    ->schema([
                        Forms\Components\Tabs::make('Langues')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('Francais')
                                    ->icon('heroicon-m-flag')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.fr')
                                            ->label('Titre (Francais)')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn(Forms\Set $set, ?string $state, string $context) => $context === 'create' ? $set('slug.fr', Str::slug($state)) : null)
                                            ->placeholder('Titre de l\'article en Francais'),

                                        Forms\Components\TextInput::make('slug.fr')
                                            ->label('Slug (Français)')
                                            ->required()
                                            ->rules(['alpha-dash'])
                                            ->maxLength(255)
                                            ->placeholder('titre-de-larticle'),

                                        Forms\Components\Textarea::make('excerpt.fr')
                                            ->label('Extrait (Français)')
                                            ->rows(3)
                                            ->maxLength(500)
                                            ->placeholder('Résumé court de l\'article...'),

                                        Forms\Components\RichEditor::make('content.fr')
                                            ->label('Contenu (Francais)')
                                            ->required()
                                            ->placeholder('Contenu complet de l\'article en français...')
                                            ->toolbarButtons([
                                                'bold', 'italic', 'underline', 'strike',
                                                'bulletList', 'orderedList', 'blockquote',
                                                'h2', 'h3', 'h4',
                                                'link', 'undo', 'redo'
                                            ])
                                            ->columnSpanFull(),

                                        Forms\Components\TextInput::make('meta_title.fr')
                                            ->label('Méta Titre (Français)')
                                            ->maxLength(60)
                                            ->helperText('Recommandé: 50-60 caractères')
                                            ->placeholder('Titre pour les moteurs de recherche'),

                                        Forms\Components\Textarea::make('meta_description.fr')
                                            ->label('Méta Description (Français)')
                                            ->rows(2)
                                            ->maxLength(160)
                                            ->helperText('Recommandé: 150-160 caractères')
                                            ->placeholder('Description pour les moteurs de recherche'),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Anglais')
                                    ->icon('heroicon-m-flag')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.en')
                                            ->label('Title (English)')
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn(Forms\Set $set, ?string $state) => $set('slug.en', Str::slug($state))
                                            )
                                            ->placeholder('Article title in English'),

                                        Forms\Components\TextInput::make('slug.en')
                                            ->label('Slug (English)')
                                            ->rules(['alpha-dash'])
                                            ->maxLength(255)
                                            ->placeholder('article-title'),

                                        Forms\Components\Textarea::make('excerpt.en')
                                            ->label('Excerpt (English)')
                                            ->rows(3)
                                            ->maxLength(500)
                                            ->placeholder('Short summary of the article...'),

                                        Forms\Components\RichEditor::make('content.en')
                                            ->label('Content (English)')
                                            ->placeholder('Full article content in English...')
                                            ->toolbarButtons([
                                                'bold', 'italic', 'underline', 'strike',
                                                'bulletList', 'orderedList', 'blockquote',
                                                'h2', 'h3', 'h4',
                                                'link', 'undo', 'redo'
                                            ])
                                            ->columnSpanFull(),

                                        Forms\Components\TextInput::make('meta_title.en')
                                            ->label('Meta Title (English)')
                                            ->maxLength(60)
                                            ->placeholder('Title for search engines'),

                                        Forms\Components\Textarea::make('meta_description.en')
                                            ->label('Meta Description (English)')
                                            ->rows(2)
                                            ->maxLength(160)
                                            ->placeholder('Description for search engines'),
                                    ])
                            ])
                            ->columnSpanFull()
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-language'),

                Forms\Components\Section::make('Média et Métadonnées')
                    ->description('Image de couverture et tags')
                    ->schema([
                        Forms\Components\FileUpload::make('featured_image')
                            ->label('Image de couverture')
                            ->image()
                            ->imageEditor()
                            ->directory('blog/featured-images')
                            ->visibility('public')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
                            ->helperText('Image d\'en-tête de l\'article (max 5MB, recommandé: 1200x630px)')
                            ->columnSpan(2),

                        Forms\Components\TagsInput::make('tags')
                            ->label('Tags')
                            ->separator(',')
                            ->placeholder('Ajouter des tags...')
                            ->helperText('Mots-clés pour categoriser l\'article')
                            ->columnSpan(1),
                    ])
                    ->columns(3)
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-photo'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')
                    ->label('Image')
                    ->circular()
                    ->size(50)
                    ->getStateUsing(fn($record) => asset('storage/' . $record->featured_image)),

                Tables\Columns\TextColumn::make('title')
                    ->label('Titre')
                    ->searchable()
                    ->weight(FontWeight::Medium)
                    ->formatStateUsing(fn(BlogArticle $record): string => $record->getTranslation('title', app()->getLocale()) ?? $record->getTranslation('title', 'fr'))
                    ->description(function (BlogArticle $record): ?string {
                        $excerpt = $record->getTranslation('excerpt', app()->getLocale()) ?? $record->getTranslation('excerpt', 'fr');
                        return $excerpt ? Str::limit($excerpt, 50) : null;
                    })
                    ->limit(50),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Catégorie')
                    ->badge()
                    ->formatStateUsing(fn(BlogArticle $record): string => $record->category->getTranslation('name', app()->getLocale()) ?? $record->category->getTranslation('name', 'fr'))
                    ->color(fn(BlogArticle $record): string => $record->category->color ?? 'primary'),

                Tables\Columns\TextColumn::make('author.name')
                    ->label('Auteur')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Statut')
                    ->badge()
                    ->colors([
                        'warning' => 'draft',
                        'success' => 'published',
                        'info' => 'scheduled'
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'draft' => '📝 Brouillon',
                        'published' => '✅ Publié',
                        'scheduled' => '⏰ Planifié',
                        default => $state
                    }),

                Tables\Columns\TextColumn::make('is_featured')
                    ->label('Vedette')
                    ->badge()
                    ->colors([
                        'warning' => true,
                        'gray' => false
                    ])
                    ->formatStateUsing(fn(string $state): string => $state ? '⭐ Oui' : 'Non'),

                Tables\Columns\TextColumn::make('views_count')
                    ->label('Vues')
                    ->numeric()
                    ->sortable()
                    ->alignCenter()
                    ->color('info'),

                Tables\Columns\TextColumn::make('reading_time')
                    ->label('Lecture')
                    ->formatStateUsing(fn(?int $state): string => $state ? $state . ' min' : 'N/A')
                    ->alignCenter()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Publié le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->placeholder('Non publié'),

                Tables\Columns\TextColumn::make('scheduled_at')
                    ->label('Planifié le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->placeholder('Non planifié')
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
                    ->relationship('category', 'name', function (Builder $query) {
                        $local = app()->getLocale() ?? 'fr';
                        $query->orderByRaw("name->>'$local' ASC");
                    })
                    ->searchable()
                    ->preload()
                    ->getOptionLabelFromRecordUsing(fn($record): string => $record->getTranslation('name', app()->getLocale()) ?? $record->getTranslation('name', 'fr')),

                Tables\Filters\SelectFilter::make('author_id')
                    ->label('Auteur')
                    ->relationship('author', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'draft' => 'Brouillon',
                        'published' => 'Publié',
                        'scheduled' => 'Planifié',
                    ]),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('En vedette')
                    ->placeholder('Tous')
                    ->trueLabel('En vedette seulement')
                    ->falseLabel('Normaux seulement'),

                Tables\Filters\Filter::make('published_at')
                    ->label('Période de publication')
                    ->form([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\DatePicker::make('published_from')
                                    ->label('Du'),
                                Forms\Components\DatePicker::make('published_until')
                                    ->label('Au'),
                            ])
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['published_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('published_at', '>=', $date),
                            )
                            ->when(
                                $data['published_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('published_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
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
            'index' => Pages\ListBlogArticles::route('/'),
            'create' => Pages\CreateBlogArticle::route('/create'),
            'edit' => Pages\EditBlogArticle::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'draft')->count();
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function canAccess(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'redacteur', 'gestionaire']);
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title', 'content', 'excerpt'];
    }

    public static function getGlobalSearchResultTitle(Model $record): string|Htmlable
    {
        return $record->getTranslation('title', app()->getLocale() ?? $record->getTranslation('title', 'fr'));
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Auteur' => $record->author?->name,
            'Catégorie' => $record->category->getTranslation('name', app()->getLocale()) ?? $record->category->getTranslation('name', 'fr'),
            'Statut' => match ($record->status) {
                'draft' => 'Brouillon',
                'published' => 'Publié',
                'scheduled' => 'Planifié',
                default => $record->status
            },
        ];
    }
}
