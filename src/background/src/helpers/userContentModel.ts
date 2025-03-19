/**
 * Defines shape of user content store. Only default shape
 */

export const userContentModel: UserContentModel = {
    details: {
        hasUsedOnce: false,
        last_used: "",
        username: "",
        updateRequired: false,
        currentProject: null
    },
    projects: {},
    schemas: {}
}