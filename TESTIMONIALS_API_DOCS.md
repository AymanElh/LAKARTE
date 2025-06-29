# Testimonials API Documentation

## Overview

The testimonials API provides essential endpoints to fetch and display customer testimonials. All endpoints are read-only and publicly accessible.

## Base URL

```
http://localhost:8080/api/testimonials
```

## Endpoints

### 1. Get All Testimonials

**GET** `/`

Returns paginated list of all published testimonials with optional filtering.

**Query Parameters:**

-   `page` (optional): Page number for pagination (default: 1)
-   `per_page` (optional): Items per page (default: 12)
-   `category` (optional): Filter by category slug
-   `type` (optional): Filter by type (`text`, `image`, `video`)
-   `min_rating` (optional): Filter by minimum rating (1-5)

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "client_name": "Ahmed Bennani",
            "client_title": "CEO",
            "client_company": "TechStart Maroc",
            "content": "Les cartes NFC de Lakarte ont révolutionné...",
            "type": "text",
            "rating": 5,
            "source": "Direct",
            "is_featured": true,
            "review_date": "2025-06-24 09:38:21",
            "review_date_human": "5 days ago",
            "category": {
                "id": 1,
                "name": "NFC Cards",
                "slug": "nfc-cards",
                "color": "#3B82F6"
            }
        }
    ],
    "pagination": {
        "current_page": 1,
        "total_pages": 3,
        "per_page": 12,
        "total": 25,
        "has_more_pages": true
    }
}
```

### 2. Get Featured Testimonials

**GET** `/featured`

Returns featured testimonials for homepage display.

**Query Parameters:**

-   `limit` (optional): Number of testimonials to return (default: 6)

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "client_name": "Ahmed Bennani",
            "content": "Les cartes NFC de Lakarte...",
            "rating": 5,
            "is_featured": true
        }
    ],
    "total": 6
}
```

### 3. Get Testimonials by Category

**GET** `/category/{categorySlug}`

Returns testimonials filtered by a specific category.

**Path Parameters:**

-   `categorySlug`: The slug of the category (e.g., "nfc-cards")

**Query Parameters:**

-   `page` (optional): Page number for pagination
-   `per_page` (optional): Items per page

**Response:**

```json
{
  "success": true,
  "data": [...],
  "category": {
    "id": 1,
    "name": "NFC Cards",
    "slug": "nfc-cards",
    "description": "Testimonials about our NFC business cards",
    "color": "#3B82F6"
  },
  "pagination": {...}
}
```

### 4. Get Testimonial Categories

**GET** `/categories`

Returns all active testimonial categories.

**Query Parameters:**

-   `with_counts` (optional): Include testimonial counts (default: false)

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "NFC Cards",
            "slug": "nfc-cards",
            "description": "Testimonials about our NFC business cards",
            "icon": "credit-card",
            "color": "#3B82F6",
            "is_active": true,
            "sort_order": 1,
            "testimonials_count": 15,
            "published_testimonials_count": 12
        }
    ],
    "total": 3
}
```

### 5. Get Testimonials Statistics

**GET** `/stats`

Returns statistics about testimonials for dashboard or display purposes.

**Response:**

```json
{
    "success": true,
    "data": {
        "total_testimonials": 25,
        "featured_testimonials": 6,
        "total_categories": 3,
        "average_rating": 4.8,
        "testimonials_by_type": {
            "text": 20,
            "image": 3,
            "video": 2
        },
        "testimonials_by_source": {
            "Google": 12,
            "Facebook": 5,
            "Direct": 8
        }
    }
}
```

## Frontend Integration

### Using the Testimonial Service

```typescript
import { testimonialService } from "../services/testimonialService";

// Get featured testimonials for homepage
const featuredTestimonials = await testimonialService.getFeaturedTestimonials({
    limit: 3,
});

// Get all testimonials with pagination
const testimonials = await testimonialService.getTestimonials({
    page: 1,
    per_page: 12,
    category: "nfc-cards",
});

// Get testimonials by category
const nfcTestimonials = await testimonialService.getTestimonialsByCategory(
    "nfc-cards"
);

// Get categories
const categories = await testimonialService.getCategories({
    with_counts: true,
});
```

### Helper Methods

```typescript
// Format star rating
const stars = testimonialService.getStarRating(5); // "★★★★★"

// Format review date
const date = testimonialService.formatReviewDate("2025-06-24"); // "24 juin 2025"

// Get client initials
const initials = testimonialService.getClientInitials("Ahmed Bennani"); // "AB"
```

## Database Structure

### Testimonials Table

-   `id`: Primary key
-   `category_id`: Foreign key to testimonial_categories
-   `client_name`: Client's full name
-   `client_title`: Job title (optional)
-   `client_company`: Company name (optional)
-   `content`: Testimonial text content
-   `type`: Type of testimonial (text, image, video)
-   `rating`: Star rating 1-5 (optional)
-   `source`: Source of testimonial (Google, Facebook, Direct, etc.)
-   `is_featured`: Whether to show on homepage
-   `is_published`: Whether publicly visible
-   `review_date`: Date of the original review

### Testimonial Categories Table

-   `id`: Primary key
-   `name`: Category name
-   `slug`: URL-friendly slug
-   `description`: Category description
-   `icon`: Icon identifier
-   `color`: Hex color code
-   `is_active`: Whether category is active
-   `sort_order`: Display order

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {...}
}
```

Common HTTP status codes:

-   `200`: Success
-   `404`: Resource not found
-   `422`: Validation error
-   `500`: Server error
