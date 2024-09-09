package hu.webshop.engine.webshopbe.container;

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

public class MailDevContainer<SELF extends MailDevContainer<SELF>> extends GenericContainer<SELF> {

    private static final int SMTP_PORT = 1025;

    public MailDevContainer(DockerImageName dockerImageName) {
        super(dockerImageName);
        this.addExposedPort(SMTP_PORT);
    }

    public int getSmtpMappedPort() {
        return this.getMappedPort(SMTP_PORT);
    }
}
