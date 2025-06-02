<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackOfferResource\Pages;
use App\Filament\Resources\PackOfferResource\RelationManagers;
use App\Models\Pack;
use App\Models\PackOffer;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class PackOfferResource extends Resource
{
    protected static ?string $model = PackOffer::class;

    protected static ?string $navigationIcon = 'heroicon-o-gift';
    protected static ?string $navigationGroup = 'Gestion des produits';
    protected static ?int $navigationSort = 2;
    protected static ?string $recordTitleAttribute = 'title';
    protected static ?string $navigationLabel = 'Offres de Packs';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informations de l\'offre')
                    ->description('Details de base de l\'offre promotionelle')
                    ->schema([
                        Forms\Components\Select::make('pack_id')
                            ->label('Pack Associé')
                            ->relationship('pack', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->placeholder('Sélectionner un pack'),

                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label('Titre de l\'offre')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('ex. Promotion Été 2024'),

                                Forms\Components\Select::make('type')
                                    ->label('Titre de l\'offre')
                                    ->options([
                                        'discount' => 'Remise',
                                        'free_item' => 'Article Gratuit',
                                        'bundle' => 'Pack bundle'
                                    ])
                                    ->required()
                                    ->native(false)
                                    ->live()
                                    ->placeholder('Sélectionner le type'),
                            ]),
                        Forms\Components\Textarea::make('description')
                            ->label('Description de l\'offre')
                            ->maxLength(1000)
                            ->rows(3)
                            ->placeholder('Décrivez les détails de cette offre...')
                            ->required()
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('value')
                            ->label('Valeur de l\'offre')
                            ->helperText('Exemple: "20%", "1 carte gratuite", "Pack de 3 pour le prix de 2"')
                            ->placeholder('ex. 20% ou 1 carte gratuite')
                            ->required()
                            ->maxLength(255),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-information-circle'),

                Forms\Components\Section::make('Période de Validité')
                    ->description('Définir la période d\'activité de l\'offre')
                    ->schema([
                        Forms\Components\DateTimePicker::make('starts_at')
                            ->label('Date de debut')
                            ->native(false)
                            ->default(now())
                            ->helperText('Quand l\'offre commence')
                            ->required(),
                        Forms\Components\DateTimePicker::make('ends_at')
                            ->label('Date de fin')
                            ->native(false)
                            ->default(now()->addWeek())
                            ->helperText('Quand l\'offre se termine')
                            ->required(),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-calendar'),

                Forms\Components\Section::make('Statut')
                    ->description('Activation et visibilité de l\'offre')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')
                            ->label('Offre Active')
                            ->helperText('Activer/desactiver cette offre')
                            ->default(false)
                            ->inline(false)
                            ->required(),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-cog-6-tooth')

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Titre')
                    ->sortable()
                    ->weight(FontWeight::Medium)
                    ->description(fn(PackOffer $record): string => Str::limit($record->description, 50))
                    ->searchable(),

                Tables\Columns\TextColumn::make('pack.name')
                    ->label('Nom de pack')
                    ->searchable()
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\BadgeColumn::make('type')
                    ->label('Type')
                    ->colors([
                        'success' => 'discount',
                        'primary' => 'free_item',
                        'warning' => 'bundle'
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'discount' => 'Remise',
                        'free_item' => 'Article Gratuit',
                        'bundle' => 'Pack Bundle',
                        default => $state
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('value')
                    ->label('Valeur')
                    ->weight(FontWeight::Bold)
                    ->color('success')
                    ->searchable(),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Statut')
                    ->getStateUsing(function (PackOffer $record): string {
                        $now = now();
                        if (!$record->is_active) {
                            return 'inactive';
                        }

                        if ($now->lt($record->starts_at)) {
                            return 'scheduled';
                        }

                        if ($now->between($record->starts_at, $record->ends_at)) {
                            return 'active';
                        }
                        return 'expired';
                    })
                    ->colors([
                        'success' => 'active',
                        'warning' => 'scheduled',
                        'danger' => 'expired',
                        'gray' => 'inactive',
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'active' => 'Active',
                        'scheduled' => 'Programmée',
                        'expired' => 'Expirée',
                        'inactive' => 'Inactive',
                        default => $state,
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('starts_at')
                    ->label('Debut')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('ends_at')
                    ->label('Fin')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('pack_id')
                    ->label('Pack')
                    ->relationship('pack', 'name')
                    ->multiple()
                    ->indicator('Pack'),

                Tables\Filters\SelectFilter::make('type')
                    ->label('Type')
                    ->options([
                        'discount' => "Remise",
                        'free_item' => "Article Gratuit",
                        'bundle' => "Pack Bundle"
                    ])
                ->multiple(),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status de l\'offre')
                    ->placeholder('Tous les offres')
                    ->trueLabel('Actives seulement')
                    ->falseLabel('Inactive seulement'),

                Tables\Filters\Filter::make('current_offers')
                    ->label('Offres Actuelle')
                    ->query(fn (Builder $query): Builder =>
                        $query
                            ->where('is_active', true)
                            ->where('starts_at', '>=', now())
                            ->where('ends_at', '<=', now())
                    ),

                Tables\Filters\Filter::make('upcoming_offers')
                    ->label('Offres a venir')
                    ->query(fn (Builder $query): Builder =>
                        $query
                            ->where('is_active', true)
                            ->where('starts_at', '>', now())
                    ),

                Tables\Filters\Filter::make('expired_offer')
                    ->label('Offres expirees')
                    ->query(fn (Builder $query): Builder =>
                        $query
                            ->where('ends_at', '<', now())
                    ),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),

                Tables\Actions\Action::make('toggle_status')
                    ->label(fn(PackOffer $record): string => $record->is_active ? 'Desactiver' : 'Activer')
                    ->icon(fn (PackOffer $record): string => $record->is_active ? 'heroicon-m-pause' : 'heroicon-m-play')
                    ->color(fn(PackOffer $record): string => $record->is_active ? 'warning' : 'success')
                    ->requiresConfirmation()
                    ->action(fn(PackOffer $record) => $record->update(['is_active' => !$record->is_active])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),


                    Tables\Actions\BulkAction::make('activate')
                        ->label('Activer Sélectionnées')
                        ->icon('heroicon-m-play')
                        ->color('success')
                        ->action(fn($records) => $records->each->update(['is_active' => true])),

                    Tables\Actions\BulkAction::make('disactivate')
                        ->label('Desactiver Sélectionnées')
                        ->icon('heroicon-m-pause')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(fn($records) => $records->each->update(['is_active' => false])),
                ]),
            ])
            ->striped()
            ->defaultSort('created_at', 'asc')
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
            'index' => Pages\ListPackOffers::route('/'),
            'create' => Pages\CreatePackOffer::route('/create'),
            'view' => Pages\ViewPackOffer::route('/{record}'),
            'edit' => Pages\EditPackOffer::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_active', true)
            ->where('starts_at', '<=', now())
            ->where('ends_at', '>=', now())
            ->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title', 'description', 'value'];
    }

    public static function getGlobalSearchResultDetails(\Illuminate\Database\Eloquent\Model $record): array
    {
        return [
            'Pack' => $record->pack?->name,
            'Type' => match($record->type) {
                'discount' => 'Remise',
                'free_item' => 'Article Gratuit',
                'bundle' => 'Pack Bundle',
                default => $record->type,
            },
            'Valeur' => $record->value,
        ];
    }
}
