<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Pack;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'pack_id' => 'required|exists:packs,id',
                'template_id' => 'required|exists:templates,id',
                'client_name' => 'required|string|max:255',
                'client_email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'city' => 'required|string|max:255',
                'neighborhood' => 'nullable|string|max:255',
                'orientation' => 'nullable|string|max:50',
                'color' => 'nullable|string|max:50',
                'quantity' => 'required|integer|min:1|max:1000',
                'channel' => 'required|in:whatsapp,form',
                'logo' => 'nullable|file|mimes:png,jpg,jpeg,svg|max:10240', // 10MB max
                'brief' => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240', // 10MB max
            ]);

            // Verify pack and template are active and template belongs to pack
            $pack = Pack::where('id', $validated['pack_id'])
                ->where('is_active', true)
                ->firstOrFail();

            $template = Template::where('id', $validated['template_id'])
                ->where('pack_id', $validated['pack_id'])
                ->where('is_active', true)
                ->firstOrFail();

            // Handle file uploads
            if ($request->hasFile('logo')) {
                $validated['logo_path'] = $request->file('logo')->store('orders/logos', 'public');
            }

            if ($request->hasFile('brief')) {
                $validated['brief_path'] = $request->file('brief')->store('orders/briefs', 'public');
            }

            // Set user_id from authenticated user
            $validated['user_id'] = Auth::id();

            // Set default status
            $validated['status'] = 'pending';

            $order = Order::create($validated);

            // Load relationships for response
            $order->load(['pack', 'template', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => new OrderResource($order),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error("Error creating the order: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error creating order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user orders (requires authentication)
     */
    public function index(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $query = Order::where('user_id', Auth::id())
                ->with(['pack', 'template']);

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $orders = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => OrderResource::collection($orders),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific order (requires authentication)
     */
    public function show($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $order = Order::where('id', $id)
                ->where('user_id', Auth::id())
                ->with(['pack', 'template', 'user'])
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => new OrderResource($order),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }
    }

    /**
     * Upload payment proof for an order
     */
    public function uploadPaymentProof(Request $request, $id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required',
                ], 401);
            }

            $validated = $request->validate([
                'payment_proof' => 'required|file|mimes:png,jpg,jpeg,pdf|max:10240', // 10MB max
            ]);

            $order = Order::where('id', $id)
                ->where('user_id', Auth::id())
                ->where('status', 'pending')
                ->firstOrFail();

            // Store the payment proof
            $paymentProofPath = $request->file('payment_proof')->store('orders/payment-proofs', 'public');

            $order->update([
                'payment_proof_path' => $paymentProofPath,
                'status' => 'in_progress'
            ]);

            $order->load(['pack', 'template', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Payment proof uploaded successfully',
                'data' => new OrderResource($order),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error uploading payment proof',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
