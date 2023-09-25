import get from "./get";
import write from "./write";

const fetch = async () => {
    const data = await get();
    await write(data);
};

export default fetch;
