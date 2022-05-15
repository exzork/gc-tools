export interface IReliquaryMain {
    Id: number;
    PropDepotId: number;
    PropType:string;
    AffixName:string;
}
export interface IReliquaryAffix {
    Id: number;
    DepotId: number;
    GroupId: number;
    PropType:string;
    PropValue:number;
}
export default class ReliquaryDataProvider {
    private static reliquaryMains:IReliquaryMain[] = [];
    private static reliquaryAffixes:IReliquaryAffix[] = [];

    public static async init(){
        await this.loadReliquaryMain();
        await this.loadReliquaryAffixes();
    }

    private static async loadReliquaryMain(){
        let data = await fetch("https://raw.githubusercontent.com/Koko-boya/Grasscutter_Resources/main/Resources/ExcelBinOutput/ReliquaryMainPropExcelConfigData.json");
        let json:IReliquaryMain[] = await data.json();
        this.reliquaryMains = [];
        json.forEach(element => {
            if (this.reliquaryMains.filter(x => x.PropType === element.PropType).length === 0)
                this.reliquaryMains.push(element)
        });
    }

    private static async loadReliquaryAffixes(){
        let data = await fetch("https://raw.githubusercontent.com/Koko-boya/Grasscutter_Resources/main/Resources/ExcelBinOutput/ReliquaryAffixExcelConfigData.json");
        let json = await data.json();
        this.reliquaryAffixes = json;
    }

    public static getReliquaryMains():IReliquaryMain[]{
        return this.reliquaryMains;
    }

    public static getReliquaryAffixes():IReliquaryAffix[]{
        return this.reliquaryAffixes;
    }
}