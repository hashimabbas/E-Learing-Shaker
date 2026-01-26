<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Cache;
use Illuminate\Routing\Controller;

class AdminCategoryController extends Controller
{
    public function __construct()
    {
        // Only Admins can manage categories
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display a listing of the categories.
     */
    public function index(): Response
    {
        $categories = Category::withCount('courses')->latest()->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'icon' => ['nullable', 'string', 'max:50'],
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon' => $validated['icon'],
        ]);

        Cache::forget('course_categories');
        return back()->with('success', 'Category created successfully.');
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($category->id)],
            'icon' => ['nullable', 'string', 'max:50'],
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon' => $validated['icon'],
        ]);

        Cache::forget('course_categories');
        return back()->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): RedirectResponse
    {
        // Optional: Prevent deletion if courses are linked
        if ($category->courses()->exists()) {
            return back()->with('error', 'Cannot delete category with existing courses.');
        }

        $category->delete();

        Cache::forget('course_categories');
        return back()->with('success', 'Category deleted successfully.');
    }
}
