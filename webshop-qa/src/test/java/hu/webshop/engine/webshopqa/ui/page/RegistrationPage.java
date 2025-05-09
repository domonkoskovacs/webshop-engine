package hu.webshop.engine.webshopqa.ui.page;

import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

import java.util.UUID;

import com.codeborne.selenide.SelenideElement;

public class RegistrationPage {
    private final SelenideElement emailInput = $("input[name='email']");
    private final SelenideElement firstnameInput = $("input[name='firstname']");
    private final SelenideElement lastnameInput = $("input[name='lastname']");
    private final SelenideElement passwordInput = $("input[name='password']");
    private final SelenideElement passwordAgainInput = $("input[name='passwordAgain']");
    private final SelenideElement phoneInput = $("input[name='phoneNumber']");
    private final SelenideElement maleOption = $("input[value='men']").parent();
    private final SelenideElement privacyPolicyToggle = $("[data-testid='switch-privacyPolicy']");
    private final SelenideElement termsToggle = $("[data-testid='switch-termsAndConditions']");
    private final SelenideElement registerButton = $("button[form='register-form'][type='submit']");

    public RegistrationPage() {
        open("/authentication?type=registration");
    }

    public void register(String email, String firstname, String lastname, String password, String phone, boolean isMale) {
        emailInput.setValue(email);
        firstnameInput.setValue(firstname);
        lastnameInput.setValue(lastname);
        passwordInput.setValue(password);
        passwordAgainInput.setValue(password);
        phoneInput.setValue(phone);

        if (isMale) {
            maleOption.click();
        }

        privacyPolicyToggle.click();
        termsToggle.click();

        registerButton.click();
    }


    public static String generateRandomEmail() {
        return "testuser+" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
    }
}
