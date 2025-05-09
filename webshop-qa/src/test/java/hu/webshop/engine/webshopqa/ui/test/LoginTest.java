package hu.webshop.engine.webshopqa.ui.test;

import static com.codeborne.selenide.Condition.appear;
import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.$;

import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopqa.configuration.TestConfiguration;
import hu.webshop.engine.webshopqa.ui.base.UiBaseTest;
import hu.webshop.engine.webshopqa.ui.page.LoginPage;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;

public class LoginTest extends UiBaseTest {

    @Epic("User Auth")
    @Feature("Login")
    @Severity(SeverityLevel.CRITICAL)
    @Test
    public void shouldLoginSuccessfully() {
        LoginPage loginPage = new LoginPage();
        loginPage.login(
                TestConfiguration.getUiUserEmail(),
                TestConfiguration.getUiUserPassword()
        );

        $("li[data-sonner-toast][data-visible='true'] div[data-title]")
                .should(appear)
                .shouldHave(text("You are successfully logged in."));
    }
}
