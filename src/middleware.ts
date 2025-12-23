import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Run next-intl middleware first
    const response = intlMiddleware(request);

    // If it's a redirect (e.g. from / to /en), return it
    if (response.status >= 300 && response.status < 400) {
        return response;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return response;
    }

    let supabaseResponse = response;

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname;

    // Strip locale from pathname for easier checking
    let pathWithoutLocale = pathname;
    let currentLocale = '';
    for (const locale of routing.locales) {
        if (pathname.startsWith(`/${locale}/`)) {
            pathWithoutLocale = pathname.replace(`/${locale}`, '');
            currentLocale = locale;
            break;
        } else if (pathname === `/${locale}`) {
            pathWithoutLocale = '/';
            currentLocale = locale;
            break;
        }
    }

    // Protect dashboard routes
    if (!user && (pathWithoutLocale === '/dashboard' || pathWithoutLocale.startsWith('/dashboard/'))) {
        const loginPath = currentLocale ? `/${currentLocale}/login` : '/login';
        return NextResponse.redirect(new URL(loginPath, request.url))
    }

    // Redirect logged in users away from login
    if (user && (pathWithoutLocale === '/login' || pathWithoutLocale.startsWith('/login/'))) {
        const dashboardPath = currentLocale ? `/${currentLocale}/dashboard` : '/dashboard';
        return NextResponse.redirect(new URL(dashboardPath, request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json (manifest file)
         * - icon-*.png (icon files)
         * - apple-touch-icon.png
         */
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|apple-touch-icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
