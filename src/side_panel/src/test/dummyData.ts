export const dummySchemaModel: Schema = {
    name: "new schea",
    id: "23323232",
    url_match: "https://ggugu",
    schema: {
      name: {
        key: {
          match_expression: "name",
          match_type: "manual",
          matched_value: "name",
        },
        value: {
          match_expression: "name_id",
          match_type: "id",
          matched_value: null,
        },
      },
      age: {
        key: {
          match_expression: ".age_div",
          match_type: "css selector",
          matched_value: "age",
        },
        value: {
          match_expression: "age_id",
          match_type: "id",
          matched_value: null,
        },
      },
      weather: {
        key: {
          match_expression: ".age_div",
          match_type: "css selector",
          matched_value: "weather",
        },
        value: {
          match_expression: "age_id",
          match_type: "id",
          matched_value: null,
        },
      },
    },
  };