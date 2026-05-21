import { useDispatch, useSelector } from 'react-redux';
import { useGetMT5AccountSymbolQuery, useMt5AccountListQuery } from '../globalState/mt5State/mt5StateApis';
import { allSymbol } from '../utils/allSymbol';
import { useMemo, useEffect } from 'react';
import { useQuotes } from '../context/QuotesContext';
import { setActiveMT5AccountLogin, setActiveMT5AccountType } from '../globalState/mt5State/mt5StateSlice';


export const useMappedSymbols = () => {

    const dispatch = useDispatch()

    const { activeMT5AccountLogin } = useSelector(state => state.mt5);
    const { token } = useSelector((state) => state.auth);


    const { data: userData, isLoading: userDataLoading } = useMt5AccountListQuery(
        { search: activeMT5AccountLogin }
    );

    const mt5Account = userData?.data?.mt5AccountList?.[0];
    const mt5LoginId = mt5Account?.id;
    const defaultSymbol = mt5Account?.defaultSymbol;

    useEffect(() => {
        if (!activeMT5AccountLogin) {
            dispatch(setActiveMT5AccountType(mt5Account?.accountType == "DEMO" ? "Demo" : "Real"))
            dispatch(setActiveMT5AccountLogin(mt5Account?.Login))
        }
    })

    const { data, isLoading: symbolsLoading } = useGetMT5AccountSymbolQuery(
        { id: mt5LoginId },
        { skip: !mt5LoginId }
    );

    const symbolList = data?.symbolList;

    const { quoteData } = useQuotes();

    const mappedSymbols = useMemo(() => {
        if (!Array.isArray(quoteData) || quoteData.length === 0) return [];

        const extensionMap = new Map();
        if (Array.isArray(symbolList)) {
            symbolList.forEach(s => {
                const base = s.includes('.') ? s.split('.')[0] : s;
                extensionMap.set(base, s);
                extensionMap.set(s, s);
            });
        }

        const allSymbolMap = new Map();
        if (Array.isArray(allSymbol)) {
            allSymbol.forEach(sym => {
                allSymbolMap.set(sym.name, sym);
            });
        }

        return quoteData.map(quote => {
            const rawSym = quote.Symbol;

            const fullSym = extensionMap.get(rawSym) || extensionMap.get(rawSym.split('.')[0]) || rawSym;
            const baseSym = fullSym.includes('.') ? fullSym.split('.')[0] : fullSym;

            const match = allSymbolMap.get(baseSym);

            if (match) {
                return {
                    ...quote,
                    ...match,
                    groupedSym: fullSym,
                    name: baseSym,
                    Symbol: fullSym
                };
            }

            return {
                ...quote,
                groupedSym: fullSym,
                name: baseSym,
                Symbol: fullSym
            };
        });
    }, [quoteData, symbolList]);

    return {
        mappedSymbols,
        defaultSymbol,
        isLoading: userDataLoading || symbolsLoading
    };
};