package hu.webshop.engine.webshopqa.ui.base;

import static com.codeborne.selenide.Selenide.open;

import java.io.File;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestWatcher;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.Screenshots;
import com.codeborne.selenide.WebDriverRunner;
import hu.webshop.engine.webshopqa.configuration.TestConfiguration;

@ExtendWith(UiBaseTest.UiTestWatcher.class)
public class UiBaseTest {

    @BeforeEach
    public void setUp() {
        Configuration.baseUrl = TestConfiguration.getUiBaseUrl();
        Configuration.browser = "chrome";
        Configuration.reportsFolder = "target/screenshots";
        open("/");
    }

    public static class UiTestWatcher implements TestWatcher {
        @Override
        public void testFailed(ExtensionContext context, Throwable cause) {
            if (WebDriverRunner.hasWebDriverStarted()) {
                try {
                    File screenshot = Screenshots.takeScreenShotAsFile();
                    if (screenshot != null)
                        System.out.println("Screenshot taken for failed test: " + screenshot.getAbsolutePath());
                } catch (Exception e) {
                    System.err.println("Screenshot capture failed: " + e.getMessage());
                }
            }
        }
    }
}
