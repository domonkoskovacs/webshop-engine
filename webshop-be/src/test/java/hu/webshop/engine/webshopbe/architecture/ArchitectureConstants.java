package hu.webshop.engine.webshopbe.architecture;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ArchitectureConstants {

    public static final String APPLICATION_ROOT_PACKAGE = "..hu.webshop.engine.webshopbe..";
    public static final String DOMAIN_PACKAGE = "..domain..";
    public static final String ENTITY_PACKAGE = "..entity..";
    public static final String REPOSITORY_PACKAGE = "..repository..";
    public static final String VALUE_PACKAGE = "..value..";
    public static final String PROPERTIES_PACKAGE = "..properties..";
    public static final String INFRASTRUCTURE_PACKAGE = "..infrastructure..";
    public static final String ADAPTER_PACKAGE = "..infrastructure.adapter..";
    public static final String MAPPER_PACKAGE = "..infrastructure.adapter.mapper..";
    public static final String CONFIG_PACKAGE = "..infrastructure.config..";
    public static final String FILTER_PACKAGE = "..infrastructure.config.filter..";
    public static final String CONTROLLER_PACKAGE = "..infrastructure.controller..";
    public static final String RESPONSE_PACKAGE = "..infrastructure.model.response..";
    public static final String REQUEST_PACKAGE = "..infrastructure.model.request..";
    public static final String CONTROLLER_CLASS_NAME_POSTFIX = "Controller";
    public static final String CONFIG_CLASS_NAME_POSTFIX = "Config";
    public static final String ADAPTER_CLASS_NAME_POSTFIX = "Adapter";
    public static final String MAPPER_CLASS_NAME_POSTFIX = "Mapper";
    public static final String ENTITY_CLASS_NAME_POSTFIX = "Entity";
    public static final String REPOSITORY_CLASS_NAME_POSTFIX = "Repository";
    public static final String SERVICE_CLASS_NAME_POSTFIX = "Service";
    public static final String FILTER_CLASS_NAME_POSTFIX = "Filter";
    public static final String PROPERTIES_CLASS_NAME_POSTFIX = "Properties";
    public static final String MAPPER_NAME = "((.*Mapper)|(.*MapperImpl))(\\$\\d{1,3})?";
    public static final String APPLICATION_LAYER = "ApplicationLayer";
    public static final String REPOSITORY_LAYER = "RepositoryLayer";
    public static final String DOMAIN_LAYER = "DomainLayer";
    public static final String ADAPTER_LAYER = "AdapterLayer";
    public static final String INFRASTRUCTURE_LAYER = "InfrastructureLayer";
    public static final String CONTROLLER_LAYER = "ControllerLayer";
}
