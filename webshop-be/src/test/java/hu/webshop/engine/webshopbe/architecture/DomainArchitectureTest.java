package hu.webshop.engine.webshopbe.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.DOMAIN_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.ENTITY_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.ENTITY_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.PROPERTIES_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.PROPERTIES_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.REPOSITORY_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.REPOSITORY_PACKAGE;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.SERVICE_CLASS_NAME_POSTFIX;
import static hu.webshop.engine.webshopbe.architecture.ArchitectureConstants.VALUE_PACKAGE;

import org.junit.jupiter.api.DisplayName;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import jakarta.persistence.Entity;

@AnalyzeClasses(packages = "hu.webshop.engine.webshopbe.domain",
        importOptions = {ImportOption.DoNotIncludeArchives.class, ImportOption.DoNotIncludeTests.class, ImportOption.DoNotIncludeJars.class})
@SuppressWarnings("unused")
@DisplayName("Domain package architecture unit tests")
public class DomainArchitectureTest {

    @ArchTest
    public static final ArchRule entitiesShouldNotHaveEntityPostfix =
            classes().that().areAnnotatedWith(Entity.class).should().haveSimpleNameNotEndingWith(ENTITY_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule entitiesShouldBeInEntityPackage =
            classes().that().areAnnotatedWith(Entity.class).should().resideInAnyPackage(ENTITY_PACKAGE);

    @ArchTest
    public static final ArchRule entitiesShouldExtendBaseEntity =
            classes().that().areAnnotatedWith(Entity.class).should().beAssignableTo(BaseEntity.class);

    @ArchTest
    public static final ArchRule repositoriesShouldBeNamedRepository =
            classes().that().areAnnotatedWith(Repository.class).should().haveSimpleNameEndingWith(REPOSITORY_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule repositoriesShouldBeAnnotatedWithRepository =
            classes().that().haveSimpleNameEndingWith(REPOSITORY_CLASS_NAME_POSTFIX).should().beAnnotatedWith(Repository.class);

    @ArchTest
    public static final ArchRule repositoriesShouldBeInRepositoryPackage =
            classes().that().areAnnotatedWith(Repository.class).or().haveSimpleNameEndingWith(REPOSITORY_CLASS_NAME_POSTFIX).should().resideInAPackage(REPOSITORY_PACKAGE);

    @ArchTest
    public static final ArchRule servicesShouldBeAnnotatedWithService =
            classes().that().haveSimpleNameEndingWith(SERVICE_CLASS_NAME_POSTFIX).should().beAnnotatedWith(Service.class);

    @ArchTest
    public static final ArchRule servicesShouldBeNamedService =
            classes().that().areAnnotatedWith(Service.class).should().haveSimpleNameEndingWith(SERVICE_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule repositoriesShouldBeOnlyAccessedByServices =
            classes().that().areAnnotatedWith(Repository.class)
                    .should().onlyBeAccessed().byClassesThat().resideInAnyPackage(DOMAIN_PACKAGE)
                    .andShould().onlyBeAccessed().byClassesThat().areAnnotatedWith(Service.class);

    @ArchTest
    public static final ArchRule propertiesShouldBeAnnotatedWithComponentAndConfigurationProperties =
            classes().that().haveSimpleNameEndingWith(PROPERTIES_CLASS_NAME_POSTFIX).should().beAnnotatedWith(Component.class).andShould().beAnnotatedWith(ConfigurationProperties.class);

    @ArchTest
    public static final ArchRule propertiesShouldBeNamedProperties =
            classes().that().areAnnotatedWith(ConfigurationProperties.class).should().haveSimpleNameEndingWith(PROPERTIES_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule propertiesShouldBeInPropertiesPackage =
            classes().that().areAnnotatedWith(ConfigurationProperties.class).should().resideInAnyPackage(PROPERTIES_PACKAGE);

    @ArchTest
    public static final ArchRule propertiesShouldBeOnlyAccessedByServices =
            classes().that().areAnnotatedWith(ConfigurationProperties.class)
                    .should().onlyBeAccessed().byClassesThat().resideInAnyPackage(DOMAIN_PACKAGE)
                    .andShould().onlyBeAccessed().byClassesThat().areAnnotatedWith(Service.class).orShould().haveSimpleNameEndingWith(PROPERTIES_CLASS_NAME_POSTFIX);

    @ArchTest
    public static final ArchRule valuePackageShouldOnlyContainEnumsOrRecords =
            classes().that().resideInAnyPackage(VALUE_PACKAGE).should().beEnums().orShould().beRecords();
}
