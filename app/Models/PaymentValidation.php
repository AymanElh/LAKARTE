<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentValidation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'order_id',
        'payment_proof_path',
        'amount_paid',
        'client_notes',
        'validation_status',
        'admin_notes',
        'validated_by',
        'validate_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'amount_paid' => 'decimal:2',
            'validate_at' => 'timestamp',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function approve(User $validator, ?string $notes): void
    {
        $this->update([
            'validation_status' => 'approved',
            'admin_notes' => $notes,
            'validate_by' => $validator->id,
            'validated_at' => now()
        ]);

        $this->order->update(['status' => 'paid']);
    }

    public function reject(User $validator, ?string $notes): void
    {
        $this->update([
            'validation_status' => 'rejected',
            'admin_notes' => $notes,
            'validated_by' => $validator,
            'validated_at' => now()
        ]);
    }
}
