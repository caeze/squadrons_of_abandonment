using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MenuSceneManager : MonoBehaviour {
    
    int i = 0;
    
	void Start() {
        Debug.Log(this.GetType().Name + " started");
    }

    void Update() {
        i = i + 1;
        
        if (i == 1) {
            UnityEngine.SceneManagement.SceneManager.LoadScene("FightScene");
        }
    }
}
