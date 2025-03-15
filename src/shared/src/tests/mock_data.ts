export const testUserContentModelData: UserContentModel = {
    details: {
      hasUsedOnce: false,
      username: "",
      last_used: "",
      updateRequired: true,
      currentProject: "a11aa111-11aa-1111-a111-1a11a1a1a111"    // project1
    },
    projects: {
      "a11aa111-11aa-1111-a111-1a11a1a1a111": {
        name: "project1",
        date_created: "2025-01-10T14:30:00",
        last_edited: "2025-03-13T14:30:00",
        id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
        captures: {
          "c11aa111-11aa-1111-a111-1a11a1a1a111": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a111",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
            name: "capture1",
            capture_body: {
              id1: "hello",
              id2: "world",
            },
          },
          "c11aa111-11aa-1111-a111-1a11a1a1a112": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a112",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a111",
            name: "capture2",
            capture_body: {
              id3: "go",
              id4: "is great",
            },
          },
        },
      },
      "a11aa111-11aa-1111-a111-1a11a1a1a112": {
        name: "project2",
        date_created: "2024-01-10T14:30:00",
        last_edited: "2024-03-13T14:30:00",
        id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
        captures: {
          "c11aa111-11aa-1111-a111-1a11a1a1a113": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a113",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
            name: "capture1",
            capture_body: {
              id1: "hello",
              id2: "world",
            },
          },
          "c11aa111-11aa-1111-a111-1a11a1a1a114": {
            id: "c11aa111-11aa-1111-a111-1a11a1a1a114",
            date_created: "2025-01-11T14:30:00",
            last_edited: "2025-01-12T14:30:00",
            project_id: "a11aa111-11aa-1111-a111-1a11a1a1a112",
            schema_id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
            name: "capture2",
            capture_body: {
              id3: "go",
              id4: "is great",
            },
          },
        },
      },
    },
    schemas: {
      "s11aa111-11aa-1111-a111-1a11a1a1a112": {
        id: "s11aa111-11aa-1111-a111-1a11a1a1a112",
        name: "schema2",
        url_match: "https://www.google.com",
        schema: {
          id3: {
            match: "id3",
            match_type: "id",
          },
          id4: {
            match: "id4",
            match_type: "id",
          },
        },
      },
      "s11aa111-11aa-1111-a111-1a11a1a1a111": {
        id: "s11aa111-11aa-1111-a111-1a11a1a1a111",
        name: "schema1",
        url_match: "https://www.amazon.com",
        schema: {
          id1: {
            match: "id1",
            match_type: "id",
          },
          id2: {
            match: "id2",
            match_type: "id",
          },
        },
      },
    },
  }; 