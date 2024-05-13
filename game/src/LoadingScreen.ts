interface ILoadingScreen {
    //What happens when loading starts
    displayLoadingUI: () => void;
    //What happens when loading stops
    hideLoadingUI: () => void;
    //default loader support. Optional!
    loadingUIBackgroundColor: string;
    loadingUIText: string;
}

export class LoadingScreen implements ILoadingScreen {
    public loadingUIBackgroundColor: string
    public loadingUIText: string
    
    public constructor() {
        this.loadingUIBackgroundColor = "";
        this.loadingUIText = "";
    }
    
    public displayLoadingUI() {
        var customLoadingScreenDiv = document.getElementById("customLoadingScreenDiv");
        // Do not add a loading screen if there is already one
        if (customLoadingScreenDiv) {
            customLoadingScreenDiv.style.display = "initial";
            return;
        }
        var loadingDiv = document.createElement("div");
        loadingDiv.id = "customLoadingScreenDiv";
        loadingDiv.innerHTML = "scene is currently loading";
        var customLoadingScreenCss = document.createElement('style');
        customLoadingScreenCss.type = 'text/css';
        customLoadingScreenCss.innerHTML = `
        #customLoadingScreenDiv{
            background-color: #BB464Bcc;
            color: white;
            font-size:50px;
            text-align:center;
        }
        `;
        document.getElementsByTagName('head')[0].appendChild(customLoadingScreenCss);
        //this._resizeLoadingUI();
        //window.addEventListener("resize", this._resizeLoadingUI);
        document.body.appendChild(loadingDiv);
    }

    public hideLoadingUI() {
        var customLoadingScreenDiv = document.getElementById("customLoadingScreenDiv");
        if (customLoadingScreenDiv) {
            customLoadingScreenDiv.style.display = "none";
        }
    }
}