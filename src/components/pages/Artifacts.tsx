import {ChangeEvent, useEffect, useState} from "react";
import ReliquaryDataProvider, {IReliquaryAffix, IReliquaryMain} from "../providers/ReliquaryDataProvider";
import {Autocomplete, Chip, createFilterOptions, TextField} from "@mui/material";

//@ts-ignore
import _ from "lodash";
import {useTranslation} from "react-i18next";

interface IArtifact {
    id: number;
    name: string;
}

export default function Artifacts() {
    const [reliquaryMains, setReliquaryMains] = useState<IReliquaryMain[]>([]);
    const [reliquaryAffixes, setReliquaryAffixes] = useState<IReliquaryAffix[]>([]);
    const [uid, setUid] = useState(0);
    const [selectedArtifact, setSelectedArtifact] = useState(0);
    const [selectedMainStat, setSelectedMainStat] = useState(0);
    const [selectedAffixes, setSelectedAffixes] = useState<number[]>([]);
    const [selectedAffixesAmount, setSelectedAffixesAmount] = useState<Record<number, number>>({});
    const [artifactEnhancements, setArtifactEnhancements] = useState(0);

    const {t} = useTranslation("artifact");

    const [artifactData, setArtifactData] = useState<IArtifact[]>([]);
    const [generatedArtifact, setGeneratedArtifact] = useState("/giveart ");

    useEffect(() => {
        const dataArtifact: IArtifact[] = [];
        const initReliquaryData = async () => {
            await ReliquaryDataProvider.init();
            setReliquaryMains(ReliquaryDataProvider.getReliquaryMains());
            setReliquaryAffixes(ReliquaryDataProvider.getReliquaryAffixes());
        };
        fetch("https://gist.githubusercontent.com/exzork/0c5ab10f35f6aa718735380d8ce585db/raw/bc14a3f87f3a49aa053a43db999d04a8f09dcd71/GM%2520Handbook.txt")
            .then(res => res.text())
            .then(text => {
                const lines = text.split("\n");
                lines.forEach(line => {
                    const lineSplit = line.split(" : ");
                    if (lineSplit.length === 2) {
                        const id = parseInt(lineSplit[0]);
                        const name = lineSplit[1];
                        if ((id >= 23341 && id <= 30000) || (id >= 51110 && id <= 99554)) {
                            if (dataArtifact.filter((x) => x.name === lineSplit[1]).length === 0) {
                                dataArtifact.push({id: id, name: name});
                            }
                        }
                    }
                });
                setArtifactData(dataArtifact);
                initReliquaryData();
            });
    }, []);

    useEffect(() => {
        handleGeneratedArtifact()
    }, [uid, selectedArtifact, selectedMainStat, selectedAffixes, selectedAffixesAmount, artifactEnhancements]);

    const handleArtifactChange = (event: any, value: any) => {
        if (value !== null) {
            setSelectedArtifact(value.id);
        }
    };

    const handleMainStatChange = (event: any, value: any) => {
        if (value !== null) {
            setSelectedMainStat(value.id);
        }
    };

    const handleAffixSelected = (event: ChangeEvent<HTMLInputElement>, amount = false, affixId=0) => {
        let newSelectedAffixes = [...selectedAffixes];
        let newSelectedAffixesAmount = {...selectedAffixesAmount};
        if (amount) {
            newSelectedAffixesAmount[affixId]=Number(event.target.value);
        } else {
            if (newSelectedAffixes.indexOf(Number(event.currentTarget.value)) === -1) {
                newSelectedAffixes.push(Number(event.currentTarget.value));
                newSelectedAffixesAmount[Number(event.currentTarget.value)] = 1;
            } else {
                newSelectedAffixes.splice(newSelectedAffixes.indexOf(Number(event.currentTarget.value)), 1);
                newSelectedAffixesAmount[Number(event.currentTarget.value)] = 0;
            }
        }
        setSelectedAffixes(newSelectedAffixes);
        setSelectedAffixesAmount(newSelectedAffixesAmount);
    };

    const getPercent = (affix:IReliquaryAffix)=>{
        if (affix.propType.indexOf("PERCENT") !== -1 || affix.propType.indexOf("CRITICAL") !== -1 || affix.propType.indexOf("EFFICIENCY") !== -1 || affix.propType.indexOf("HURT") !== -1 || affix.propType.indexOf("RATIO") !== -1 || affix.propType.indexOf("ADD") !== -1) {
            return parseFloat(String(affix.propValue*100)).toPrecision(3) + "%";
        }
        return parseInt(String(affix.propValue));
    };

    const handleGeneratedArtifact = () => {
        let selectedAffixesCombine: (string | number)[] = [];
        if (selectedAffixes.length > 0) {
            selectedAffixesCombine = selectedAffixes.map(x => {
                if (selectedAffixesAmount[x] > 1) {
                    return x + "," + selectedAffixesAmount[x];
                }
                return x;
            });
        }
        const generated = "/giveart "+uid+" "+selectedArtifact+" "+selectedMainStat+" "+selectedAffixesCombine.join(" ")+" "+Number(artifactEnhancements+1);
        setGeneratedArtifact(generated);
    };
    return (
            <form method="POST" className="space-y-8 divide-y divide-gray-200 bg-white p-10">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div>
                        <div>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('fill_details')}</p>
                        </div>
                        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                            <div
                                className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="name"
                                       className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    {t("uid")}
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input type="text" aria-label="UID" name="uid" id="uid"  className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" onChange={(event) => setUid(parseInt(event.target.value))}/>
                                </div>
                            </div>
                            <div
                                className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="description"
                                       className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                                    {t('name')}
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <Autocomplete
                                        aria-label="Artifact Name" id="ArtifactName"
                                        className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                        options={artifactData}
                                        getOptionLabel={(option) => t(option.name)}
                                        onChange={handleArtifactChange}
                                        renderInput={(params) => <TextField {...params} label="Artifact Name" variant="outlined"/>}
                                    />
                                </div>
                            </div>
                            <div
                                className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="image"
                                       className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                    {t('main_stats')}
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <div
                                        className="relative h-10 rounded-lg flex justify-center items-center">
                                       <Autocomplete
                                            aria-label="Artifact Main Stats" id="ArtifactMainStats"
                                            className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                            options={reliquaryMains}
                                            getOptionLabel={(option) => t(option.propType)}
                                            onChange={handleMainStatChange}
                                            renderInput={(params) => <TextField {...params} label="Main Stats" variant="outlined"/>}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="start_date"
                                       className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                                    {t('sub_stats')}
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2 h-48 overflow-auto">
                                    {reliquaryAffixes.map((affix, index) => {
                                        return (
                                            <div key={index} className="flex">
                                                <input type="checkbox" className="mr-4 ml-4 focus:ring-indigo-500 h-4 w-4 mt-1 text-indigo-600 border-gray-300 rounded" value={affix.id} id={"select-"+affix.id} onChange={(e)=>handleAffixSelected(e,false,0)}/>
                                                <label className="flex-grow" htmlFor={"select-"+affix.id}>{t(affix.propType) +" - "+getPercent(affix)}</label>
                                                <input type="number" defaultValue="1" min="1" className="flex-none block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" onChange={(e)=>handleAffixSelected(e,true, affix.id)}/>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div
                                className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <label htmlFor="start_date"
                                       className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                                    {t('enhancement_level')}
                                </label>
                                <div className="mt-1 sm:mt-0 sm:col-span-2">
                                    <input type="number" defaultValue="1" min="1" max="20" className="w-full flex-none block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" onChange={(e)=>setArtifactEnhancements(Number(e.currentTarget.value))}/>
                                </div>
                            </div>
                            <div className="block sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                                <input type="text" onClick={(e)=>{navigator.clipboard.writeText(e.currentTarget.value)}} className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" value={generatedArtifact} readOnly/>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
    );
}