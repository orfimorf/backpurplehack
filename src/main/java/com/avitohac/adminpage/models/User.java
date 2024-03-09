package com.avitohac.adminpage.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
public class User {
    private Long id;
    private Long location_id;
    private Long microcategory_id;
    @Setter
    private Long cost;
}
