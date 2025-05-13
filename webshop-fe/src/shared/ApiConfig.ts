import {Configuration} from "./api";

/**
 * Provides a centralized API configuration.
 * Ensures that all services use the same base configuration.
 */
export class ApiConfig {
    private static instance: Configuration;

    /**
     * Returns a singleton instance of the API configuration.
     */
    static getConfig(): Configuration {
        console.log(import.meta.env.VITE_BACKEND_URL)
        if (!this.instance) {
            this.instance = new Configuration({
                basePath: import.meta.env.VITE_BACKEND_URL,
                baseOptions: {
                    withCredentials: true,
                    timeout: 10000,
                },
            });
        }
        return this.instance;
    }
}
