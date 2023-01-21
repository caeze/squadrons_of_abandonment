using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PrefabFactory : MonoBehaviour {
    
	void Start() {
        Debug.Log(this.GetType().Name + " started");
    }

    void Update() {
        
    }
    
    /*
     * Creates a game object from a prefab specified by its path.
     */
    public T createBuildingFromPrefab<T>(string prefabPath) where T : SoaGameObject {
        GameObject prefab = (GameObject) Instantiate(Resources.Load(prefabPath));
        T newComponent = prefab.AddComponent<T>();
        return newComponent;
    }
}

