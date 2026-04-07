import { AuthService } from "./auth/AuthService";
import { AuthServiceApiImpl } from "./auth/AuthServiceApiImpl";
import { ProfileService } from "./profile/ProfileService";
import { ProfileServiceApiImpl } from "./profile/ProfileServiceApiImpl";
import { CreateTextService } from "./text/CreateTextService";
import { CreateTextServiceApiImpl } from "./text/CreateTextServiceApiImpl";
import {CatalogService} from "./catalog/CatalogService";
import {CatalogServiceMockImpl} from "./catalog/CatalogServiceMockImpl";

export class ServiceRegistry {
    private static _authService: AuthService;
    private static _profileService: ProfileService;
    private static _createTextService: CreateTextService;
    private static _catalogService: CatalogService;

    static get authService(): AuthService {
        if (!this._authService) {
            this._authService = new AuthServiceApiImpl();
        }
        return this._authService;
    }

    static get profileService(): ProfileService {
        if (!this._profileService) {
            this._profileService = new ProfileServiceApiImpl();
        }
        return this._profileService;
    }

    static get createTextService(): CreateTextService {
        if (!this._createTextService) {
            this._createTextService = new CreateTextServiceApiImpl();
        }
        return this._createTextService;
    }

    static get catalogService(): CatalogService {
        if (!this._catalogService) {
            this._catalogService = new CatalogServiceMockImpl();
        }
        return this._catalogService;
    }
}