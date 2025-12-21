import { AuthService } from "./auth/AuthService";
import { AuthServiceMockImpl } from "./auth/AuthServiceMockImpl";
import { ProfileService } from "./profile/ProfileService";
import { ProfileServiceMockImpl } from "./profile/ProfileServiceMockImpl";
import {CreateTextService} from "./text/CreateTextService";
import {CreateTextServiceMockImpl} from "./text/CreateTextServiceMockImpl";
import {CatalogService} from "./catalog/CatalogService";
import {CatalogServiceMockImpl} from "./catalog/CatalogServiceMockImpl";

export class ServiceRegistry {
    private static _authService: AuthService;
    private static _profileService: ProfileService;
    private static _createTextService: CreateTextService;
    private static _catalogService: CatalogService;

    static get authService(): AuthService {
        if (!this._authService) {
            this._authService = new AuthServiceMockImpl();
        }
        return this._authService;
    }

    static get profileService(): ProfileService {
        if (!this._profileService) {
            this._profileService = new ProfileServiceMockImpl();
        }
        return this._profileService;
    }

    static get createTextService(): CreateTextService {
        if (!this._createTextService) {
            this._createTextService = new CreateTextServiceMockImpl();
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