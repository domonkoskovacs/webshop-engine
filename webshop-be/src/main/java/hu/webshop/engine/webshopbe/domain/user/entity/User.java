package hu.webshop.engine.webshopbe.domain.user.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.value.AddressType;
import hu.webshop.engine.webshopbe.domain.user.value.Gender;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "webshop_user")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity implements UserDetails {

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "firstname", nullable = false)
    private String firstname;

    @Column(name = "lastname", nullable = false)
    private String lastname;

    @Column(name = "user_password", nullable = false)
    private String password;

    @Column(name = "user_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Builder.Default
    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Builder.Default
    @Column(name = "subscribed_to_email", nullable = false)
    private boolean subscribedToEmail = false;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "user_id", nullable = false)
    private List<Address> addresses = new ArrayList<>();

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "user_id", nullable = false)
    private List<Cart> cart = new ArrayList<>();

    @Builder.Default
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "saved",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> saved = new ArrayList<>();

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "user")
    private List<Order> orders = new ArrayList<>();

    public void addSaved(List<Product> products) {
        this.saved.addAll(products);
    }

    public void removeSaved(List<Product> products) {
        this.saved.removeAll(products);
    }

    public void addCart(Cart cartItem) {
        this.cart.add(cartItem);
    }

    public void removeCart(Cart cartItem) {
        this.cart.remove(cartItem);
    }

    public String getFullName() {
        return firstname + " " + lastname;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isEnabled() {
        return verified;
    }

    public void clearCart() {
        this.cart.clear();
    }

    public Product getMostDiscontedSavedProduct() {
        return this.saved.stream().max(Comparator.comparing(Product::getDiscountPercentage)).orElse(null);
    }

    public Address getShippingAddress() {
        return addresses.stream()
                .filter(a -> a.getType() == AddressType.SHIPPING)
                .findFirst()
                .orElse(null);
    }

    public Address getBillingAddress() {
        return addresses.stream()
                .filter(a -> a.getType() == AddressType.BILLING)
                .findFirst()
                .orElse(null);
    }

    public void setShippingAddress(Address newShippingAddress) {
        addresses.removeIf(a -> a.getType() == AddressType.SHIPPING);
        newShippingAddress.setType(AddressType.SHIPPING);
        addresses.add(newShippingAddress);
    }

    public void setBillingAddress(Address newBillingAddress) {
        addresses.removeIf(a -> a.getType() == AddressType.BILLING);
        newBillingAddress.setType(AddressType.BILLING);
        addresses.add(newBillingAddress);
    }

}
