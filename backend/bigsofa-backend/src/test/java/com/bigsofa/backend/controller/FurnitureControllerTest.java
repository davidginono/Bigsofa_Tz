package com.bigsofa.backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;

import com.bigsofa.backend.model.FurnitureCategory;
import com.bigsofa.backend.repository.FurnitureCategoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers(disabledWithoutDocker = true)
class FurnitureControllerTest {

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("bigsofa_test")
            .withUsername("test")
            .withPassword("test");

    @AfterAll
    static void stopContainer() {
        postgres.stop();
    }

    @DynamicPropertySource
    static void registerDataSourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FurnitureCategoryRepository categoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private FurnitureCategory sofas;

    @BeforeEach
    void setUp() {
        categoryRepository.deleteAll();
        sofas = categoryRepository.save(new FurnitureCategory("Sofas"));
    }

    @Test
    void uploadImageAndRetrieveByCategory() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "file",
                "sofa.png",
                MediaType.IMAGE_PNG_VALUE,
                "fake-image".getBytes(StandardCharsets.UTF_8)
        );

        String uploadResponse = mockMvc.perform(
                        multipart("/api/furniture")
                                .file(image)
                                .param("categoryId", sofas.getId().toString())
                                .param("name", "Premium Sofa")
                                .param("description", "Soft and comfy")
                                .param("priceCents", "49900")
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode createdNode = objectMapper.readTree(uploadResponse);
        long itemId = createdNode.get("id").asLong();
        assertThat(createdNode.get("imageUrl").asText()).isEqualTo("/api/furniture/%d/image".formatted(itemId));
        assertThat(createdNode.get("categoryId").asLong()).isEqualTo(sofas.getId());

        mockMvc.perform(
                        multipart("/api/furniture")
                                .file(image)
                                .param("categoryId", sofas.getId().toString())
                                .param("name", "Duplicate Sofa")
                                .param("description", "Same image")
                                .param("priceCents", "49900")
                )
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/furniture").param("categoryId", sofas.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(result -> {
                    JsonNode list = objectMapper.readTree(result.getResponse().getContentAsString());
                    assertThat(list).hasSize(1);
                    assertThat(list.get(0).get("name").asText()).isEqualTo("Premium Sofa");
                    assertThat(list.get(0).get("categoryId").asLong()).isEqualTo(sofas.getId());
                });

        mockMvc.perform(get("/api/furniture/{id}/image", itemId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG))
                .andExpect(result -> assertThat(result.getResponse().getContentAsByteArray())
                        .isEqualTo("fake-image".getBytes(StandardCharsets.UTF_8)));
    }
}
