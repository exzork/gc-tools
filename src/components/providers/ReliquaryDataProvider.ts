export interface IReliquaryMain {
    id: number;
    propDepotId: number;
    propType:string;
    affixName:string;
}
export interface IReliquaryAffix {
    id: number;
    depotId: number;
    groupId: number;
    propType:string;
    propValue:number;
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
            if (this.reliquaryMains.filter(x => x.propType === element.propType).length === 0)
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