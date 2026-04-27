import { Page } from '@playwright/test';

/**
 * Navigates to `url` safely by first waiting for any in-progress navigation to
 * settle (domcontentloaded), then issuing the goto.
 *
 * Without this guard, calling page.goto() while a redirect chain from a prior
 * click/navigation is still in flight causes Firefox to throw NS_BINDING_ABORTED
 * because the new request cancels the unfinished one. Draining the load state
 * first ensures the engine is idle before we start a new navigation.
 */
export async function safeGoto(
    page: Page,
    url: string,
    timeout = 20000,
): Promise<void> {
    try {
        // Drain any in-flight navigation before starting a new one.
        // waitForLoadState resolves immediately if the page is already stable.
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    } catch {
        // Page may be in an error/aborted state — proceed anyway.
    }
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
}

/**
 * Recovers from a google_vignette interstitial by pausing briefly to let the
 * ongoing redirect chain fully settle in Firefox, then issuing a safe navigation
 * to `targetUrl`.
 *
 * Call this after detecting `page.url().includes('google_vignette')`.
 */
export async function recoverFromVignette(
    page: Page,
    targetUrl: string,
    timeout = 20000,
): Promise<void> {
    // Give Firefox ~500 ms to finish processing the vignette redirect chain
    // before we issue a new navigation, preventing a second NS_BINDING_ABORTED.
    await page.waitForTimeout(500);
    await safeGoto(page, targetUrl, timeout);
}
