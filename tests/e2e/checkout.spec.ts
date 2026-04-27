import { expect, test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { LoginPage } from '../../pages/login.page';
import { ProductsPage } from '../../pages/products.page';
import { createAccountViaApi } from '../../requests/auth.api';
import { createRandomSignupUser } from '../../utils/user-factory';
import { safeGoto } from '../../utils/navigation';

async function loginWithFreshUser(page: any, request: any) {
    const user = createRandomSignupUser();
    const loginPage = new LoginPage(page);

    await createAccountViaApi(request, user);
    // safeGoto drains any in-flight navigation before requesting /login,
    // preventing NS_BINDING_ABORTED in Firefox after the API call resolves.
    await safeGoto(page, '/login');
    await loginPage.login(user.email, user.password);
    await loginPage.verifyLoginSuccess();

    return user;
}

test.describe('Checkout Tests', () => {
    test.beforeEach(async ({ page }) => {
        const cartPage = new CartPage(page);
        await cartPage.clearCartIfNeeded();
    });

    test('CHK-001 should complete full checkout flow from cart to payment page', async ({
        page,
        request,
    }) => {
        const productsPage = new ProductsPage(page);
        const checkoutPage = new CheckoutPage(page);

        await loginWithFreshUser(page, request);
        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();

        await checkoutPage.proceedToCheckoutFromCart();
        await checkoutPage.verifyCheckoutPageSections();
        await checkoutPage.placeOrderAndOpenPayment();

        await expect(page).toHaveURL(/\/payment/);
    });

    test('CHK-002 should place order and show confirmation', async ({
        page,
        request,
    }) => {
        const productsPage = new ProductsPage(page);
        const checkoutPage = new CheckoutPage(page);

        const user = await loginWithFreshUser(page, request);
        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();

        await checkoutPage.proceedToCheckoutFromCart();
        await checkoutPage.placeOrderAndOpenPayment();
        await checkoutPage.fillPaymentDetails({
            nameOnCard: user.name,
            cardNumber: '4242424242424242',
            cvc: '123',
            expiryMonth: '12',
            expiryYear: '2030',
        });
        await checkoutPage.submitPayment();
        await checkoutPage.verifyOrderPlacedSuccessfully();
    });

    test('CHK-003 should display delivery address on checkout page', async ({
        page,
        request,
    }) => {
        const productsPage = new ProductsPage(page);
        const checkoutPage = new CheckoutPage(page);

        const user = await loginWithFreshUser(page, request);
        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();

        await checkoutPage.proceedToCheckoutFromCart();
        await checkoutPage.verifyCheckoutPageSections();
        await checkoutPage.verifyDeliveryAddressContains(user.firstName);
        await checkoutPage.verifyDeliveryAddressContains(user.lastName);
        await checkoutPage.verifyDeliveryAddressContains(user.address);
        await checkoutPage.verifyDeliveryAddressContains(user.city);
        await checkoutPage.verifyDeliveryAddressContains(user.state);
    });

    test('CHK-004 should show empty cart state when cart has no items', async ({
        page,
    }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await cartPage.goToCartPage();
        await checkoutPage.verifyEmptyCartState();
        await expect(page.getByText('Proceed To Checkout')).toHaveCount(0);
    });

    test('CHK-005 should block payment submission when required payment field is blank', async ({
        page,
        request,
    }) => {
        const productsPage = new ProductsPage(page);
        const checkoutPage = new CheckoutPage(page);

        await loginWithFreshUser(page, request);
        await productsPage.goToProductsPage();
        await productsPage.addFirstProductToCartAndOpenCart();

        await checkoutPage.proceedToCheckoutFromCart();
        await checkoutPage.placeOrderAndOpenPayment();
        await checkoutPage.fillPaymentDetails({
            nameOnCard: 'Test User',
            cardNumber: '',
            cvc: '123',
            expiryMonth: '12',
            expiryYear: '2030',
        });

        await checkoutPage.submitPaymentWithoutRequiredDetails();
        await checkoutPage.verifyPaymentFieldRequired('cardNumber');
    });
});
