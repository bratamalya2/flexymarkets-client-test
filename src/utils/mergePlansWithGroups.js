import StarBorderIcon from '@mui/icons-material/StarBorder';

export const mergePlansWithGroups = (groupList = []) => {
    return groupList.map((group) => {
        return {
            leverage: group?.leverage && group?.leverage || "----",
            tag: group?.recomendation && group?.recomendation || "Professional",
            description: group?.message && group?.message || "---------",
            icon: StarBorderIcon,
            features: {
                minDeposit: group?.minDeposit && `${group?.minDeposit} USD` || "0 USD",
                spread: group?.spread && `From ${group?.spread}` || "No spread",
                commission: group?.commission || "No commission",
                leverage: group?.leverage && group?.leverage || "----",
            },
            isRecommended: (group?.recomendation)?.toUpperCase() === ("Recomanded").toUpperCase() ? true : false,
            title: group?.name && group?.name || "----",
            groupId: group?.id
        };
    });
};