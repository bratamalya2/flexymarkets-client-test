import { Divider, Stack } from '@mui/material'
import MarketNewsTags from './MarketNewsTags'
import MarketNewsList from './MarketNewsList'

function MarketNews() {
    return (
        <Stack>
            <MarketNewsTags />
            <Divider sx={{ my: "2rem" }} />
            <MarketNewsList />
        </Stack>
    )
}

export default MarketNews;