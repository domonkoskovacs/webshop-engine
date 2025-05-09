package hu.webshop.engine.webshopqa.ui.page;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

import com.codeborne.selenide.SelenideElement;

public class LoginPage {
    private final SelenideElement emailInput = $("input[name='email']");
    private final SelenideElement passwordInput = $("input[name='password']");
    private final SelenideElement loginButton = $("button[form='login-form'][type='submit']");

    public LoginPage() {
        open("/authentication?type=login");
    }

    public void login(String email, String password) {
        emailInput.setValue(email);
        passwordInput.setValue(password);
        loginButton.click();
    }
}
