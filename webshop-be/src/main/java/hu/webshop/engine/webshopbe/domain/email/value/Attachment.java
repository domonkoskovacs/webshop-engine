package hu.webshop.engine.webshopbe.domain.email.value;

import java.util.Arrays;
import java.util.Objects;

public record Attachment(String name, byte[] data) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Attachment person = (Attachment) o;
        return Objects.equals(name, person.name) && Arrays.equals(data, person.data);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(name);
        result = 31 * result + Arrays.hashCode(data);
        return result;
    }

    @Override
    public String toString() {
        return "Person{" +
                "names=" + Arrays.toString(data) +
                ", age=" + name +
                '}';
    }

}
