<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

trait JsonQueryHelper
{
    /**
     * Add a where clause for JSON field search across multiple languages
     */
    public function scopeWhereJsonLike(Builder $query, string $field, string $search, array $locales = ['en', 'fr', 'ar']): Builder
    {
        return $query->where(function ($q) use ($field, $search, $locales) {
            foreach ($locales as $locale) {
                if ($this->isPostgreSQL()) {
                    $q->orWhereRaw("{$field}->>'$locale' ILIKE ?", ["%{$search}%"]);
                } else {
                    $q->orWhereRaw("JSON_EXTRACT({$field}, '$.{$locale}') LIKE ?", ["%{$search}%"]);
                }
            }
        });
    }

    /**
     * Add a where clause for exact JSON field match across multiple languages
     */
    public function scopeWhereJsonEquals(Builder $query, string $field, string $value, array $locales = ['en', 'fr', 'ar']): Builder
    {
        return $query->where(function ($q) use ($field, $value, $locales) {
            foreach ($locales as $locale) {
                if ($this->isPostgreSQL()) {
                    $q->orWhereRaw("{$field}->>'$locale' = ?", [$value]);
                } else {
                    $q->orWhereRaw("JSON_EXTRACT({$field}, '$.{$locale}') = ?", [$value]);
                }
            }
        });
    }

    /**
     * Add order by JSON field for specific locale
     */
    public function scopeOrderByJson(Builder $query, string $field, string $locale = 'en', string $direction = 'asc'): Builder
    {
        if ($this->isPostgreSQL()) {
            return $query->orderByRaw("{$field}->>'$locale' COLLATE \"C\" $direction");
        } else {
            return $query->orderByRaw("JSON_EXTRACT({$field}, '$.{$locale}') $direction");
        }
    }

    /**
     * Check if the current database connection is PostgreSQL
     */
    private function isPostgreSQL(): bool
    {
        return DB::connection()->getDriverName() === 'pgsql';
    }
}
