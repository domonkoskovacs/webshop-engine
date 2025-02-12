package hu.webshop.engine.webshopbe.domain.product;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.product.entity.Category;
import hu.webshop.engine.webshopbe.domain.product.entity.SubCategory;
import hu.webshop.engine.webshopbe.domain.product.repository.CategoryRepository;
import hu.webshop.engine.webshopbe.domain.product.repository.SubCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;

    public List<Category> getAll() {
        log.info("getAll");
        return categoryRepository.findAll();
    }

    public SubCategory getSubCategoryById(UUID id) {
        log.info("getSubCategoryById > id: [{}]", id);
        return subCategoryRepository.findById(id).orElseThrow(this::entityNotFoundException);
    }

    private EntityNotFoundException entityNotFoundException() {
        return new EntityNotFoundException("Category was not found");
    }

    public SubCategory getSubCategoryByName(String name) {
        log.info("getSubCategoryByName > name: [{}]", name);
        return subCategoryRepository.findByName(name).orElseThrow(this::entityNotFoundException);
    }

    public Category create(Category category) {
        log.info("create > category: [{}]", category);
        return categoryRepository.save(category);
    }

    public Category addSubCategory(UUID id, SubCategory subCategory) {
        log.info("addSubCategory > id: [{}], subCategory: [{}]", id, subCategory);
        Category byId = getById(id);
        byId.addSubCategory(subCategory);
        subCategory.setCategory(byId);
        return categoryRepository.save(byId);
    }

    public Category getById(UUID id) {
        log.info("getById");
        return categoryRepository.findById(id).orElseThrow(this::entityNotFoundException);
    }

    public Category updateCategory(UUID id, String name) {
        log.info("updateCategory > id: [{}], name: [{}]", id, name);
        Category byId = getById(id);
        byId.setName(name);
        return categoryRepository.save(byId);
    }

    public void delete(UUID id) {
        log.info("delete > id: [{}]", id);
        categoryRepository.deleteById(id);
    }

    public void deleteSubCategory(UUID id) {
        log.info("deleteSubCategory > id: [{}]", id);
        SubCategory subCategory = getSubCategoryById(id);
        Category category = subCategory.getCategory();
        category.getSubCategories().remove(subCategory);
        categoryRepository.save(category);
        subCategoryRepository.deleteById(id);
    }

    public boolean subCategoryExistsByName(String name) {
        return subCategoryRepository.existsByName(name);
    }
}
