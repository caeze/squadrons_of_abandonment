using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InitSceneManager : MonoBehaviour {
    
	void Start() {
        Debug.Log(this.GetType().Name + " component starting with parent game object " + name);
        Debug.Log(this.GetType().Name + " started.");
    }

    void Update() {
        UnityEngine.SceneManagement.SceneManager.LoadScene("MenuScene");
    }
}
