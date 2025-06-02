<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentValidationResource\Pages;
use App\Filament\Resources\PaymentValidationResource\RelationManagers;
use App\Models\PaymentSetting;
use App\Models\PaymentValidation;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Notifications\Notification;

class PaymentValidationResource extends Resource
{
    protected static ?string $model = PaymentValidation::class;

    protected static ?string $navigationIcon = 'heroicon-o-banknotes';
    protected static ?string $navigationGroup = 'Gestion des commandes';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = 'Validation Paiements';
    protected static ?string $pluralModelLabel = 'Validations de Paiement';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Informations de Paiement')
                    ->description('Détails du paiement soumis par le client')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('order_id')
                                    ->label('Commande')
                                    ->relationship('order', 'client_name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->getOptionLabelFromRecordUsing(fn($record) => "#{$record->id} - {$record->client_name}")
                                    ->disabled(fn(string $operation): bool => $operation === 'edit'),

                                TextInput::make('amount_paid')
                                    ->label('Montant Payé (DH)')
                                    ->required()
                                    ->numeric()
                                    ->step(0.01)
                                    ->prefix('DH')
                                    ->placeholder('0.00'),
                            ]),

                        Textarea::make('client_notes')
                            ->label('Notes du Client')
                            ->rows(3)
                            ->placeholder('Notes ou commentaires du client...')
                            ->columnSpanFull(),

                        FileUpload::make('payment_proof_path')
                            ->label('Justificatif de Paiement')
                            ->image()
                            ->required()
                            ->directory('payments/proofs')
                            ->visibility('private')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
                            ->helperText('Capture d\'écran ou photo du virement (max 5MB)')
                            ->columnSpanFull(),
                    ])
                    ->icon('heroicon-m-document-currency-dollar'),

                Section::make('Validation Administrative')
                    ->description('Section réservée aux administrateurs')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('validation_status')
                                    ->label('Statut de Validation')
                                    ->options([
                                        'pending' => 'En attente',
                                        'approved' => 'Approuvé',
                                        'rejected' => 'Rejeté',
                                    ])
                                    ->default('pending')
                                    ->native(false)
                                    ->disabled(fn(string $operation): bool => $operation === 'create'),

                                Select::make('validated_by')
                                    ->label('Validé par')
                                    ->relationship('validator', 'name')
                                    ->searchable()
                                    ->disabled()
                                    ->visible(fn(string $operation): bool => $operation === 'edit'),
                            ]),

                        Textarea::make('admin_notes')
                            ->label('Notes Administratives')
                            ->rows(3)
                            ->placeholder('Commentaires sur la validation...')
                            ->columnSpanFull()
                            ->disabled(fn(string $operation): bool => $operation === 'create'),
                    ])
                    ->icon('heroicon-m-shield-check')
                    ->visible(fn(string $operation): bool => $operation === 'edit'),

                Section::make('Informations Bancaires Actuelles')
                    ->description('RIB actuel pour les paiements')
                    ->schema([
                        Forms\Components\Placeholder::make('bank_info')
                            ->label('')
                            ->columnSpanFull(),
                    ])
                    ->icon('heroicon-m-building-library')
                    ->collapsible()
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('#')
                    ->sortable()
                    ->prefix('#'),

                TextColumn::make('order.id')
                    ->label('Commande')
                    ->sortable()
                    ->prefix('#')
                    ->url(fn(PaymentValidation $record): string => route('filament.admin.resources.orders.edit', $record->order)
                    ),

                TextColumn::make('order.client_name')
                    ->label('Client')
                    ->searchable()
                    ->weight(FontWeight::Medium),

                TextColumn::make('amount_paid')
                    ->label('Montant')
                    ->money('MAD')
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->color('success'),

                ImageColumn::make('payment_proof_path')
                    ->label('Justificatif')
                    ->circular()
                    ->size(40),

                BadgeColumn::make('validation_status')
                    ->label('Statut')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'approved',
                        'danger' => 'rejected',
                    ])
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'pending' => 'En attente',
                        'approved' => 'Approuvé',
                        'rejected' => 'Rejeté',
                        default => $state
                    }),

                TextColumn::make('validator.name')
                    ->label('Validé par')
                    ->placeholder('Non validé')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('validated_at')
                    ->label('Validé le')
                    ->dateTime('d/m/Y H:i')
                    ->placeholder('Non validé')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->label('Soumis le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('validation_status')
                    ->label('Statut')
                    ->options([
                        'pending' => 'En attente',
                        'approved' => 'Approuvé',
                        'rejected' => 'Rejeté',
                    ]),

                Tables\Filters\Filter::make('created_at')
                    ->label('Période')
                    ->form([
                        Grid::make(2)
                            ->schema([
                                Forms\Components\DatePicker::make('created_from')
                                    ->label('Du'),
                                Forms\Components\DatePicker::make('created_until')
                                    ->label('Au'),
                            ])
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label('Approuver')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn(PaymentValidation $record): bool => $record->validation_status === 'pending')
                    ->form([
                        Textarea::make('admin_notes')
                            ->label('Notes (optionnel)')
                            ->rows(3),
                    ])
                    ->action(function (PaymentValidation $record, array $data): void {
                        $record->approve(auth()->user(), $data['admin_notes'] ?? null);

                        Notification::make()
                            ->title('Paiement approuvé')
                            ->body('Le paiement a été approuvé et la commande est maintenant payée.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label('Rejeter')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn(PaymentValidation $record): bool => $record->validation_status === 'pending')
                    ->form([
                        Textarea::make('admin_notes')
                            ->label('Raison du rejet')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (PaymentValidation $record, array $data): void {
                        $record->reject(auth()->user(), $data['admin_notes']);

                        Notification::make()
                            ->title('Paiement rejeté')
                            ->body('Le paiement a été rejeté.')
                            ->warning()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListPaymentValidations::route('/'),
            'create' => Pages\CreatePaymentValidation::route('/create'),
            'edit' => Pages\EditPaymentValidation::route('/{record}/edit'),
        ];
    }
}
