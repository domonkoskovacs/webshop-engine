package hu.webshop.engine.webshopbe.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.constructors;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.fields;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.methods;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_USE_FIELD_INJECTION;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.ADAPTER_LAYER;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.ADAPTER_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.APPLICATION_LAYER;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.APPLICATION_ROOT_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.CONFIG_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.CONTROLLER_LAYER;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.CONTROLLER_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.DOMAIN_LAYER;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.DOMAIN_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.INFRASTRUCTURE_LAYER;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.INFRASTRUCTURE_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.REPOSITORY_LAYER;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.REPOSITORY_PACKAGE;

import org.junit.jupiter.api.DisplayName;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(packages = "hu.webshop.engine.webshopbe",
        importOptions = {ImportOption.DoNotIncludeArchives.class, ImportOption.DoNotIncludeTests.class, ImportOption.DoNotIncludeJars.class})
@SuppressWarnings("unused")
@DisplayName("Architecture unit tests")
public class ArchitectureTest {

    @ArchTest
    public static final ArchRule layering =
            layeredArchitecture().consideringAllDependencies()
                    .layer(APPLICATION_LAYER).definedBy(APPLICATION_ROOT_PACKAGE)
                    .layer(REPOSITORY_LAYER).definedBy(REPOSITORY_PACKAGE)
                    .layer(DOMAIN_LAYER).definedBy(DOMAIN_PACKAGE)
                    .layer(ADAPTER_LAYER).definedBy(ADAPTER_PACKAGE)
                    .layer(INFRASTRUCTURE_LAYER).definedBy(INFRASTRUCTURE_PACKAGE)
                    .layer(CONTROLLER_LAYER).definedBy(CONTROLLER_PACKAGE)
                    .whereLayer(REPOSITORY_LAYER).mayOnlyBeAccessedByLayers(DOMAIN_LAYER)
                    .whereLayer(DOMAIN_LAYER).mayOnlyBeAccessedByLayers(ADAPTER_LAYER, INFRASTRUCTURE_LAYER)
                    .whereLayer(ADAPTER_LAYER).mayOnlyBeAccessedByLayers(INFRASTRUCTURE_LAYER)
                    .whereLayer(INFRASTRUCTURE_LAYER).mayOnlyBeAccessedByLayers(ADAPTER_LAYER, APPLICATION_LAYER)
                    .whereLayer(CONTROLLER_LAYER).mayNotBeAccessedByAnyLayer()
                    .whereLayer(APPLICATION_LAYER).mayNotBeAccessedByAnyLayer();

    @ArchTest
    public static final ArchRule domainClassesShouldNotCallInfrastructureClasses =
            noClasses().that().resideInAnyPackage(DOMAIN_PACKAGE).should().dependOnClassesThat().resideInAPackage(INFRASTRUCTURE_PACKAGE);

    @ArchTest
    public static final ArchRule domainServicesShouldOnlyBeAccessByAdaptersAndDomainServicesAndConfigs =
            classes().that().resideInAnyPackage(DOMAIN_PACKAGE).and().areAnnotatedWith(Service.class)
                    .should().onlyBeAccessed().byClassesThat().resideInAnyPackage(DOMAIN_PACKAGE, ADAPTER_PACKAGE, CONFIG_PACKAGE);
    @ArchTest
    public static final ArchRule noFieldInjection = NO_CLASSES_SHOULD_USE_FIELD_INJECTION;
    @ArchTest
    public static final ArchRule noCycles = slices().matching("hu.webshop.engine.webshopbe..").should().beFreeOfCycles();
    @ArchTest
    public static final ArchRule utilityClassesShouldHavePrivateConstructors =
            classes().that().haveSimpleNameEndingWith("Util")
                    .or().haveSimpleNameEndingWith("Utils")
                    .or().haveSimpleNameEndingWith("Constant")
                    .or().haveSimpleNameEndingWith("Constants")
                    .should().haveOnlyPrivateConstructors();
    @ArchTest
    public static final ArchRule noValueAnnotationOnMethods =
            methods().should().notBeAnnotatedWith(Value.class);
    @ArchTest
    public static final ArchRule noValueAnnotationOnConstructors =
            constructors().should().notBeAnnotatedWith(Value.class);
    @ArchTest
    public static final ArchRule noValueAnnotationOnFields =
            fields().should().notBeAnnotatedWith(Value.class);
    @ArchTest
    public final ArchRule loggersShouldBePrivateStaticFinalAndNamedLog =
            fields().that().haveRawType(Logger.class)
                    .should().bePrivate()
                    .andShould().beStatic()
                    .andShould().beFinal()
                    .andShould().haveName("log")
                    .because("Use lombok @Slf4j annotation");
}
