package com.news.ingestion;

import com.news.ingestion.model.SyntheticRecord;
import net.datafaker.Faker;

import java.util.List;
import java.util.stream.IntStream;


public class SyntheticDataGenerator {

    private final Faker faker = new Faker();

    public List<SyntheticRecord> generate (int count) {

        if (count < 0 ) {
            throw new IllegalArgumentException("Count cannot be negative");

        }
    return IntStream.range(0,count)
            .mapToObj(i -> new SyntheticRecord(
                    faker.name().fullName(),
                    faker.internet().emailAddress(),
                    faker.lorem().paragraph(),
                    faker.internet().url()
            )).toList();

    }



}