import {TextPreview} from "../../entity/TextPreview";

export interface CatalogService {
    getAll(): Promise<TextPreview[]>;
}