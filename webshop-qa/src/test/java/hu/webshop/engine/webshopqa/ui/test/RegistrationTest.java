package hu.webshop.engine.webshopqa.ui.test;

import static com.codeborne.selenide.Condition.appear;
import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.$;

import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopqa.ui.base.UiBaseTest;
import hu.webshop.engine.webshopqa.ui.page.RegistrationPage;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;

public class RegistrationTest extends UiBaseTest {

    @Epic("User Auth")
    @Feature("Register")
    @Severity(SeverityLevel.CRITICAL)
    @Test
    public void shouldRegisterSuccessfully() {
        RegistrationPage regPage = new RegistrationPage();
        String email = RegistrationPage.generateRandomEmail();

        regPage.register(
                email,
                "John",
                "Doe",
                "password123",
                "+36201234567",
                true
        );

        $("li[data-sonner-toast] div[data-title]")
                .should(appear)
                .shouldHave(text("Successful registration."));
    }

}
