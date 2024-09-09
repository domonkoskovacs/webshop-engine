package hu.webshop.engine.webshopbe.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.ADAPTER_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.ADAPTER_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.CONFIG_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.CONFIG_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.CONTROLLER_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.CONTROLLER_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.FILTER_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.FILTER_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.INFRASTRUCTURE_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.MAPPER_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.MAPPER_NAME;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.MAPPER_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.REQUEST_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.RESPONSE_PACKAGE;

import org.junit.jupiter.api.DisplayName;
import org.mapstruct.Mapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;

@AnalyzeClasses(packages = "hu.webshop.engine.webshopbe.infrastructure",
        importOptions = {ImportOption.DoNotIncludeArchives.class, ImportOption.DoNotIncludeTests.class, ImportOption.DoNotIncludeJars.class})
@SuppressWarnings("unused")
@DisplayName("Infrastructure package architecture unit tests")
public class InfrastructureArchitectureTest {

    @ArchTest
    public static final ArchRule configurationsShouldBeNamedConfig =
            classes().that().areAnnotatedWith(Configuration.class).should().haveSimpleNameEndingWith(CONFIG_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule configurationsShouldBeAnnotatedWithConfiguration =
            classes().that().haveSimpleNameEndingWith(CONFIG_CLASS_NAME_POSTFIX).should().beAnnotatedWith(Configuration.class);

    @ArchTest
    public static final ArchRule configurationsShouldBeInConfigPackage =
            classes().that().areAnnotatedWith(Configuration.class).should().resideInAnyPackage(CONFIG_PACKAGE);

    @ArchTest
    public static final ArchRule filtersShouldBeNamedFilter =
            classes().that().areAssignableTo(OncePerRequestFilter.class).should().haveSimpleNameEndingWith(FILTER_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule filtersShouldBeInFilterPackage =
            classes().that().haveSimpleNameEndingWith(FILTER_CLASS_NAME_POSTFIX).should().resideInAnyPackage(FILTER_PACKAGE);

    @ArchTest
    public static final ArchRule adaptersShouldBeNamedAdapterOrMapper =
            classes().that().resideInAnyPackage(ADAPTER_PACKAGE)
                    .should().haveSimpleNameEndingWith(ADAPTER_CLASS_NAME_POSTFIX)
                    .orShould().haveNameMatching(MAPPER_NAME);

    @ArchTest
    public static final ArchRule adaptersShouldBeAnnotatedWithService =
            classes().that().haveSimpleNameEndingWith(ADAPTER_CLASS_NAME_POSTFIX).should().beAnnotatedWith(Service.class);

    @ArchTest
    public static final ArchRule adaptersShouldBeInAdapterPackage =
            classes().that().haveSimpleNameEndingWith(ADAPTER_CLASS_NAME_POSTFIX).should().resideInAnyPackage(ADAPTER_PACKAGE);

    @ArchTest
    public static final ArchRule mappersShouldBeAnnotatedWithMapper =
            classes().that().haveSimpleNameEndingWith(MAPPER_CLASS_NAME_POSTFIX).should().beAnnotatedWith(Mapper.class);

    @ArchTest
    public static final ArchRule mappersShouldResideInMapperPackage =
            classes().that().haveSimpleNameEndingWith(MAPPER_CLASS_NAME_POSTFIX).should().resideInAnyPackage(MAPPER_PACKAGE);

    @ArchTest
    public static final ArchRule mappersShouldOnlyBeAccessedFromInfrastructurePackage =
            classes().that().haveNameMatching(MAPPER_NAME)
                    .should().onlyBeAccessed().byClassesThat().resideInAnyPackage(INFRASTRUCTURE_PACKAGE);

    @ArchTest
    public static final ArchRule controllersShouldShouldBeNamedController =
            classes().that().areAnnotatedWith(RestController.class).should().haveSimpleNameEndingWith(CONTROLLER_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule controllersShouldBeAnnotatedWithRestController =
            classes().that().haveSimpleNameEndingWith(CONTROLLER_CLASS_NAME_POSTFIX).should().beAnnotatedWith(RestController.class);

    @ArchTest
    public static final ArchRule controllersShouldBeInControllerPackage =
            classes().that().areAnnotatedWith(RestController.class).should().resideInAnyPackage(CONTROLLER_PACKAGE);

    @ArchTest
    public static final ArchRule responsesShouldBeRecords =
            classes().that().resideInAnyPackage(RESPONSE_PACKAGE).should().beRecords();

    @ArchTest
    public static final ArchRule requestsShouldBeRecords =
            classes().that().resideInAnyPackage(REQUEST_PACKAGE).should().beRecords();
}
