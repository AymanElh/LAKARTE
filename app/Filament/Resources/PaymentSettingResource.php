<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentSettingResource\Pages;
use App\Filament\Resources\PaymentSettingResource\RelationManagers;
use App\Models\PaymentSetting;
use Filament\Forms;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PaymentSettingResource extends Resource
{
    protected static ?string $model = PaymentSetting::class;


    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationGroup = 'Configuration';
    protected static ?int $navigationSort = 1;
    protected static ?string $navigationLabel = 'Paramètres de Paiement';
    protected static ?string $pluralModelLabel = 'Paramètres de Paiement';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Informations Bancaires')
                    ->description('Détails du compte bancaire pour les paiements')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('bank_name')
                                    ->label('Nom de la Banque')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('ex: Banque Populaire'),

                                TextInput::make('account_holder')
                                    ->label('Titulaire du Compte')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Nom du titulaire'),

                                TextInput::make('rib_number')
                                    ->label('Numéro RIB')
                                    ->required()
                                    ->unique(PaymentSetting::class, 'rib_number', ignoreRecord: true)
                                    ->maxLength(24)
                                    ->placeholder('XXXXXXXXXXXXXXXXXXXXXXXXX'),

                                TextInput::make('iban')
                                    ->label('IBAN')
                                    ->maxLength(34)
                                    ->placeholder('MA64XXXXXXXXXXXXXXXXXXXXXXXXX'),

                                TextInput::make('swift_code')
                                    ->label('Code SWIFT/BIC')
                                    ->maxLength(11)
                                    ->placeholder('XXXXXXXX'),

                                Toggle::make('is_active')
                                    ->label('Compte Actif')
                                    ->helperText('Seul un compte peut être actif à la fois')
                                    ->default(true),
                            ]),

                        Textarea::make('payment_instructions')
                            ->label('Instructions de Paiement')
                            ->rows(4)
                            ->placeholder('Instructions détaillées pour les clients...')
                            ->columnSpanFull(),
                    ])
                    ->icon('heroicon-m-building-library'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('bank_name')
                    ->label('Banque')
                    ->searchable()
                    ->weight(FontWeight::Medium),

                TextColumn::make('account_holder')
                    ->label('Titulaire')
                    ->searchable(),

                TextColumn::make('rib_number')
                    ->label('RIB')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('RIB copié!')
                    ->formatStateUsing(fn(string $state): string => substr($state, 0, 4) . ' ' .
                        substr($state, 4, 4) . ' ' .
                        substr($state, 8, 4) . ' ' .
                        substr($state, 12)
                    ),

                BadgeColumn::make('is_active')
                    ->label('Statut')
                    ->colors([
                        'success' => true,
                        'danger' => false
                    ])
                    ->formatStateUsing(fn(bool $state): string => $state ? 'Actif' : 'Inactif'),

                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Statut')
                    ->placeholder('Tous')
                    ->trueLabel('Actif seulement')
                    ->falseLabel('Inactif seulement'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->striped()
            ->recordUrl(fn($record) => static::getUrl('view', ['record' => $record]));
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
            'index' => Pages\ListPaymentSettings::route('/'),
            'create' => Pages\CreatePaymentSetting::route('/create'),
            'view' => Pages\ViewPaymentSetting::route('/{record}'),
            'edit' => Pages\EditPaymentSetting::route('/{record}/edit'),
        ];
    }
}
