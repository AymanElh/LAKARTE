<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Actions\RestoreAction;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Gestion des commandes';
    protected static ?int $navigationSort = 1;
    protected static ?string $recordTitleAttribute = 'client_name';
    protected static ?string $navigationLabel = 'Commandes';
    protected static ?string $pluralModelLabel = 'Commandes';


    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Détails de la commande')
                    ->description('Informations principales de la commande')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('user_id')
                                    ->label('Utilisateur')
                                    ->relationship('user', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->placeholder('Sélectionner un utilisateur'),

                                Select::make('status')
                                    ->label('Statut')
                                    ->options([
                                        'pending' => 'En attente',
                                        'in_progress' => 'En cours',
                                        'paid' => 'Payée',
                                        'shipped' => 'Expédiée',
                                        'canceled' => 'Annulée',
                                    ])
                                    ->default('pending')
                                    ->required()
                                    ->native(false),

                                Select::make('channel')
                                    ->label('Canal')
                                    ->options([
                                        'whatsapp' => 'WhatsApp',
                                        'form' => 'Formulaire',
                                    ])
                                    ->default('form')
                                    ->required()
                                    ->native(false),
                            ]),

                        Grid::make(2)
                            ->schema([
                                Select::make('pack_id')
                                    ->label('Pack')
                                    ->relationship('pack', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->live()
                                    ->afterStateUpdated(fn(Forms\Set $set) => $set('template_id', null))
                                    ->placeholder('Sélectionner un pack'),

                                Select::make('template_id')
                                    ->label('Template')
                                    ->relationship(
                                        'template',
                                        'name',
                                        fn(Builder $query, Forms\Get $get) => $query->where('pack_id', $get('pack_id'))
                                    )
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->disabled(fn(Forms\Get $get): bool => !filled($get('pack_id')))
                                    ->placeholder('Sélectionner un template'),
                            ]),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-shopping-cart'),

                Section::make('Informations client')
                    ->description('Détails du client et coordonnées')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('client_name')
                                    ->label('Nom du client')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Nom complet du client'),

                                TextInput::make('client_email')
                                    ->label('Email du client')
                                    ->email()
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('email@exemple.com'),

                                TextInput::make('phone')
                                    ->label('Téléphone')
                                    ->tel()
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('+212 6XX XXX XXX'),

                                TextInput::make('city')
                                    ->label('Ville')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Ville du client'),

                                TextInput::make('neighborhood')
                                    ->label('Quartier')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Quartier/Zone'),
                            ]),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-user'),

                Section::make('Préférences de design')
                    ->description('Spécifications et personnalisations')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('orientation')
                                    ->label('Orientation')
                                    ->maxLength(255)
                                    ->placeholder('Portrait/Paysage'),

                                TextInput::make('color')
                                    ->label('Couleur')
                                    ->maxLength(255)
                                    ->placeholder('Couleur principale'),

                                TextInput::make('quantity')
                                    ->label('Quantité')
                                    ->numeric()
                                    ->required()
                                    ->default(1)
                                    ->minValue(1)
                                    ->placeholder('Nombre d\'exemplaires'),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-paint-brush'),

                Section::make('Fichiers et documents')
                    ->description('Logo, brief et justificatifs')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                FileUpload::make('logo_path')
                                    ->label('Logo')
                                    ->image()
                                    ->directory('orders/logos')
                                    ->visibility('private')
                                    ->maxSize(5120)
                                    ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg'])
                                    ->helperText('Logo du client (max 5MB)'),

                                FileUpload::make('brief_path')
                                    ->label('Brief/Cahier des charges')
                                    ->acceptedFileTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                                    ->directory('orders/briefs')
                                    ->visibility('private')
                                    ->maxSize(10240)
                                    ->helperText('Document PDF/Word (max 10MB)'),

                                FileUpload::make('payment_proof_path')
                                    ->label('Justificatif de paiement')
                                    ->image()
                                    ->directory('orders/payments')
                                    ->visibility('private')
                                    ->maxSize(5120)
                                    ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
                                    ->helperText('Preuve de paiement (max 5MB)'),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-document'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#')
                    ->searchable()
                    ->sortable()
                    ->prefix('#'),

                Tables\Columns\TextColumn::make('client_name')
                    ->label('Client')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Medium)
                    ->description(fn(Order $record): string => $record->client_email),

                Tables\Columns\BadgeColumn::make('pack.name')
                    ->label('Pack')
                    ->searchable()
                    ->color('primary'),

                Tables\Columns\BadgeColumn::make('template.name')
                    ->label('Template')
                    ->searchable()
                    ->color('gray'),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Statut')
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'in_progress',
                        'success' => 'paid',
                        'primary' => 'shipped',
                        'danger' => 'cancelled'
                    ])
                    ->formatStateUsing(fn(String $state): string => match($state) {
                        'pending' => 'En attend',
                        'in_progress' => 'En cours',
                        'paid' => 'Payée',
                        'shipped' => 'Expédiée',
                        'cancelled' => 'Annulée',
                        default => $state
                    }),

                Tables\Columns\BadgeColumn::make('channel')
                    ->label('Channel')
                    ->colors([
                        'success' => 'whatsapp',
                        'primary' => 'form'
                    ])
                    ->formatStateUsing(fn(String $state): string => match($state) {
                        'whatsapp' => 'Whatsapp',
                        'form' => 'Formulaire',
                        default => $state
                    }),

                Tables\Columns\TextColumn::make('quantity')
                    ->label('Qte')
                    ->numeric()
                    ->sortable()
                    ->alignCenter()
                    ->color('infos'),

                Tables\Columns\TextColumn::make('city')
                    ->label('Ville')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Telephone')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Commandé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Statut')
                    ->options([
                        'pending' => 'En attend',
                        'in_progress' => 'En cours',
                        'paid' => 'Payée',
                        'shipped' => 'Expédiée',
                        'cancelled' => 'Annulée'
                    ]),

                Tables\Filters\SelectFilter::make('channel')
                    ->label('Channel')
                    ->options([
                        'whatsapp' => 'Whatsapp',
                        'form' => 'Formulaire'
                    ]),

                Tables\Filters\SelectFilter::make('pack_id')
                    ->label('Pack')
                    ->relationship('pack', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\Filter::make('created_at')
                    ->label('Période de commande')
                    ->form([
                        Grid::make(2)
                            ->schema([
                                Forms\Components\DatePicker::make('created_from')
                                    ->label('Du'),
                                Forms\Components\DatePicker::make('created_until')
                                    ->label('Au')
                            ])
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date)
                            )
                            ->when(
                                $data['created_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date)
                            );
                    }),

                Tables\Filters\TrashedFilter::make()
                    ->label('Commandes supprimées'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->label('')
                    ->tooltip('Modifier cette commande'),

                Tables\Actions\DeleteAction::make()
                    ->label('')
                    ->tooltip('Supprimer cetter commande')
                    ->successNotification(
                        Notification::make()
                            ->title('Commande supprime')
                            ->body('La commande a été déplacée dans les éléments supprimés.')
                            ->success()
                    ),

                Tables\Actions\RestoreAction::make()
                    ->label('')
                    ->tooltip('Restaurer')
                    ->icon('heroicon-o-arrow-path')
                    ->color('success')
                    ->visible(fn($record) => !is_null($record->deleted_at))
                    ->successNotification(
                        Notification::make()
                            ->title('Command restaure')
                            ->body('La command a ete restaure avec success')
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
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->recordUrl(fn($record): string => static::getUrl('view', ['record' => $record]))
            ->defaultSort('created_at', 'desc')
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
            'view' => Pages\ViewOrder::route('/{record}'),
        ];
    }
}
