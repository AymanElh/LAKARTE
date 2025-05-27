<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Client Information')
                    ->description('Customer details and contact information')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('client_name')
                                    ->label('Client Name')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Enter client full name'),

                                Forms\Components\TextInput::make('client_email')
                                    ->label('Email Address')
                                    ->email()
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('client@email.com'),

                                Forms\Components\TextInput::make('client_phone')
                                    ->label('Phone Number')
                                    ->tel()
                                    ->required()
                                    ->maxLength(20)
                                    ->placeholder('+212 6 54 32 10 98'),

                                Forms\Components\TextInput::make('client_city')
                                    ->label('City')
                                    ->required()
                                    ->maxLength(100)
                                    ->placeholder('Enter city name'),

                                Forms\Components\TextInput::make('client_district')
                                    ->label('District/Area')
                                    ->maxLength(100)
                                    ->placeholder('Enter district or area'),
                            ]),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-user'),

                Forms\Components\Section::make('Order Details')
                    ->description('Product selection and customization')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('pack_id')
                                    ->label('Pack')
                                    ->relationship('pack', 'title')
                                    ->required()
                                    ->searchable()
                                    ->preload()
                                    ->placeholder('Select a pack'),

                                Forms\Components\Select::make('template_id')
                                    ->label('Template')
                                    ->relationship('template', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->nullable()
                                    ->placeholder('Select a template (optional)'),

                                Forms\Components\Select::make('orientation')
                                    ->label('Orientation')
                                    ->options([
                                        'portrait' => 'Portrait',
                                        'landscape' => 'Landscape',
                                        'square' => 'Square',
                                    ])
                                    ->required()
                                    ->default('portrait')
                                    ->placeholder('Select orientation'),

                                Forms\Components\ColorPicker::make('color')
                                    ->label('Primary Color')
                                    ->nullable()
                                    ->placeholder('Choose primary color'),

                                Forms\Components\TextInput::make('quantity')
                                    ->label('Quantity')
                                    ->numeric()
                                    ->required()
                                    ->default(1)
                                    ->minValue(1)
                                    ->maxValue(1000)
                                    ->step(1),
                            ]),

                        Forms\Components\Textarea::make('special_notes')
                            ->label('Special Notes')
                            ->placeholder('Any special instructions or notes for this order...')
                            ->maxLength(1000)
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-shopping-bag'),

                Forms\Components\Section::make('Order Status & Source')
                    ->description('Order status and origin tracking')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\Select::make('status')
                                    ->label('Order Status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'in_progress' => 'In Progress',
                                        'paid' => 'Paid',
                                        'shipped' => 'Shipped',
                                        'delivered' => 'Delivered',
                                        'cancelled' => 'Cancelled',
                                    ])
                                    ->required()
                                    ->default('pending')
                                    ->native(false),

                                Forms\Components\Select::make('payment_status')
                                    ->label('Payment Status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'paid' => 'Paid',
                                        'failed' => 'Failed',
                                    ])
                                    ->required()
                                    ->default('pending')
                                    ->native(false),

                                Forms\Components\Select::make('source')
                                    ->label('Order Source')
                                    ->options([
                                        'form' => 'Website Form',
                                        'whatsapp' => 'WhatsApp',
                                    ])
                                    ->required()
                                    ->default('form')
                                    ->native(false),
                            ]),

                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Toggle::make('is_offered')
                                    ->label('Is Offered (Free)')
                                    ->helperText('Mark this order as offered/free'),

                                Forms\Components\TextInput::make('tracking_number')
                                    ->label('Tracking Number')
                                    ->maxLength(100)
                                    ->placeholder('Enter tracking number'),
                            ]),
                    ])
                    ->collapsible()
                    ->icon('heroicon-m-clipboard-document-list'),

                Forms\Components\Section::make('File Uploads')
                    ->description('Client assets and payment proof')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\FileUpload::make('logo_path')
                                    ->label('Client Logo')
                                    ->image()
                                    ->imageEditor()
                                    ->directory('orders/logos')
                                    ->visibility('private')
                                    ->maxSize(5120) // 5MB
                                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/svg+xml'])
                                    ->helperText('Upload client logo (max 5MB)'),

                                Forms\Components\FileUpload::make('brief_pdf_path')
                                    ->label('Brief Document')
                                    ->acceptedFileTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                                    ->directory('orders/briefs')
                                    ->visibility('private')
                                    ->maxSize(10240) // 10MB
                                    ->helperText('Upload brief PDF/DOC (max 10MB)'),

                                Forms\Components\FileUpload::make('payment_screenshot_path')
                                    ->label('Payment Proof')
                                    ->image()
                                    ->directory('orders/payments')
                                    ->visibility('private')
                                    ->maxSize(5120) // 5MB
                                    ->acceptedFileTypes(['image/jpeg', 'image/png'])
                                    ->helperText('Upload payment screenshot (max 5MB)'),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-document-arrow-up'),

                Forms\Components\Section::make('Delivery Information')
                    ->description('Shipping and delivery tracking')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\DateTimePicker::make('shipped_at')
                                    ->label('Shipped At')
                                    ->nullable()
                                    ->native(false),

                                Forms\Components\DateTimePicker::make('delivered_at')
                                    ->label('Delivered At')
                                    ->nullable()
                                    ->native(false),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed()
                    ->icon('heroicon-m-truck'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('client_name'),
                Tables\Columns\TextColumn::make('client_email'),
                Tables\Columns\TextColumn::make('client_phone'),
                Tables\Columns\TextColumn::make('pack.title')
                    ->label('Pack'),
                Tables\Columns\TextColumn::make('status')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Created At'),
            ])
            ->filters([
                //
            ])
            ->actions([
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
