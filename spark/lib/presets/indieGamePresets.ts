/**
 * Indie Game Presets for Fast Prototyping
 *
 * Small, fast templates for common game archetypes
 * Optimized for WebGL and low-end hardware
 */

export interface GamePreset {
  id: string;
  name: string;
  description: string;
  category: "2d" | "3d" | "ui";
  scripts: Array<{
    name: string;
    path: string;
    content: string;
  }>;
  assets: Array<{
    type: "sprite" | "audio" | "prefab" | "material";
    name: string;
    config: Record<string, any>;
  }>;
  buildConfig: {
    target: string;
    development: boolean;
    compressionFormat: string;
    maxTextureSize: number;
  };
}

export const indieGamePresets: GamePreset[] = [
  {
    id: "2d-platformer",
    name: "2D Platformer",
    description: "Classic side-scrolling platformer with physics and controls",
    category: "2d",
    scripts: [
      {
        name: "PlayerController",
        path: "Assets/Scripts/PlayerController.cs",
        content: `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Movement")]
    public float moveSpeed = 5f;
    public float jumpForce = 10f;

    [Header("Ground Check")]
    public Transform groundCheck;
    public float groundCheckRadius = 0.2f;
    public LayerMask groundLayer;

    private Rigidbody2D rb;
    private bool isGrounded;
    private float horizontalInput;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        horizontalInput = Input.GetAxisRaw("Horizontal");

        isGrounded = Physics2D.OverlapCircle(groundCheck.position, groundCheckRadius, groundLayer);

        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        }
    }

    void FixedUpdate()
    {
        rb.velocity = new Vector2(horizontalInput * moveSpeed, rb.velocity.y);
    }
}`,
      },
      {
        name: "CameraFollow",
        path: "Assets/Scripts/CameraFollow.cs",
        content: `using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    public Transform target;
    public float smoothSpeed = 0.125f;
    public Vector3 offset = new Vector3(0, 0, -10);

    void LateUpdate()
    {
        if (target == null) return;

        Vector3 desiredPosition = target.position + offset;
        Vector3 smoothedPosition = Vector3.Lerp(transform.position, desiredPosition, smoothSpeed);
        transform.position = smoothedPosition;
    }
}`,
      },
    ],
    assets: [
      {
        type: "sprite",
        name: "PlayerSprite",
        config: { size: 32, pixelsPerUnit: 32, filterMode: "Point" },
      },
      {
        type: "material",
        name: "PixelPerfect",
        config: { shader: "Sprites/Default", renderQueue: 3000 },
      },
    ],
    buildConfig: {
      target: "WebGL",
      development: false,
      compressionFormat: "Gzip",
      maxTextureSize: 1024,
    },
  },
  {
    id: "top-down-action",
    name: "Top-Down Action",
    description: "Top-down view with 8-directional movement and combat",
    category: "2d",
    scripts: [
      {
        name: "TopDownController",
        path: "Assets/Scripts/TopDownController.cs",
        content: `using UnityEngine;

public class TopDownController : MonoBehaviour
{
    [Header("Movement")]
    public float moveSpeed = 5f;
    public bool rotateToMovement = true;

    private Rigidbody2D rb;
    private Vector2 movement;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");
        movement.Normalize();

        if (rotateToMovement && movement.magnitude > 0)
        {
            float angle = Mathf.Atan2(movement.y, movement.x) * Mathf.Rad2Deg - 90f;
            transform.rotation = Quaternion.Euler(0, 0, angle);
        }
    }

    void FixedUpdate()
    {
        rb.velocity = movement * moveSpeed;
    }
}`,
      },
      {
        name: "EnemyAI",
        path: "Assets/Scripts/EnemyAI.cs",
        content: `using UnityEngine;

public class EnemyAI : MonoBehaviour
{
    public Transform player;
    public float chaseRange = 10f;
    public float moveSpeed = 3f;
    public float stopDistance = 2f;

    private Rigidbody2D rb;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        if (player == null)
        {
            player = GameObject.FindGameObjectWithTag("Player")?.transform;
        }
    }

    void Update()
    {
        if (player == null) return;

        float distance = Vector2.Distance(transform.position, player.position);

        if (distance < chaseRange && distance > stopDistance)
        {
            Vector2 direction = (player.position - transform.position).normalized;
            rb.velocity = direction * moveSpeed;
        }
        else
        {
            rb.velocity = Vector2.zero;
        }
    }
}`,
      },
    ],
    assets: [
      {
        type: "sprite",
        name: "CharacterSprite",
        config: { size: 32, pixelsPerUnit: 32, filterMode: "Point" },
      },
      {
        type: "sprite",
        name: "EnemySprite",
        config: { size: 32, pixelsPerUnit: 32, filterMode: "Point" },
      },
    ],
    buildConfig: {
      target: "WebGL",
      development: false,
      compressionFormat: "Gzip",
      maxTextureSize: 512,
    },
  },
  {
    id: "visual-novel",
    name: "Visual Novel",
    description: "Dialogue system with character portraits and choices",
    category: "ui",
    scripts: [
      {
        name: "DialogueManager",
        path: "Assets/Scripts/DialogueManager.cs",
        content: `using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class DialogueManager : MonoBehaviour
{
    [Header("UI Elements")]
    public Text nameText;
    public Text dialogueText;
    public Image characterPortrait;
    public GameObject choicePanel;
    public Button[] choiceButtons;

    [Header("Settings")]
    public float textSpeed = 0.05f;

    private Queue<string> sentences = new Queue<string>();
    private bool isTyping;

    public void StartDialogue(string characterName, Sprite portrait, string[] lines)
    {
        nameText.text = characterName;
        characterPortrait.sprite = portrait;

        sentences.Clear();
        foreach (string sentence in lines)
        {
            sentences.Enqueue(sentence);
        }

        DisplayNextSentence();
    }

    public void DisplayNextSentence()
    {
        if (isTyping) return;

        if (sentences.Count == 0)
        {
            EndDialogue();
            return;
        }

        string sentence = sentences.Dequeue();
        StopAllCoroutines();
        StartCoroutine(TypeSentence(sentence));
    }

    IEnumerator TypeSentence(string sentence)
    {
        isTyping = true;
        dialogueText.text = "";

        foreach (char letter in sentence.ToCharArray())
        {
            dialogueText.text += letter;
            yield return new WaitForSeconds(textSpeed);
        }

        isTyping = false;
    }

    void EndDialogue()
    {
        Debug.Log("Dialogue ended");
    }

    public void ShowChoices(string[] choices)
    {
        choicePanel.SetActive(true);
        for (int i = 0; i < choiceButtons.Length; i++)
        {
            if (i < choices.Length)
            {
                choiceButtons[i].gameObject.SetActive(true);
                choiceButtons[i].GetComponentInChildren<Text>().text = choices[i];
            }
            else
            {
                choiceButtons[i].gameObject.SetActive(false);
            }
        }
    }
}`,
      },
      {
        name: "SceneTransition",
        path: "Assets/Scripts/SceneTransition.cs",
        content: `using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class SceneTransition : MonoBehaviour
{
    public Image fadeImage;
    public float fadeDuration = 1f;

    public void FadeOut()
    {
        StartCoroutine(Fade(0, 1));
    }

    public void FadeIn()
    {
        StartCoroutine(Fade(1, 0));
    }

    IEnumerator Fade(float start, float end)
    {
        float elapsed = 0;
        Color color = fadeImage.color;

        while (elapsed < fadeDuration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / fadeDuration;
            color.a = Mathf.Lerp(start, end, t);
            fadeImage.color = color;
            yield return null;
        }

        color.a = end;
        fadeImage.color = color;
    }
}`,
      },
    ],
    assets: [
      {
        type: "sprite",
        name: "DialogueBox",
        config: { size: 512, sliceType: "9-slice" },
      },
      {
        type: "sprite",
        name: "CharacterPortrait",
        config: { size: 256, compression: "high" },
      },
    ],
    buildConfig: {
      target: "WebGL",
      development: false,
      compressionFormat: "Gzip",
      maxTextureSize: 1024,
    },
  },
];

export function getPresetById(id: string): GamePreset | undefined {
  return indieGamePresets.find((p) => p.id === id);
}

export function getPresetsByCategory(
  category: "2d" | "3d" | "ui"
): GamePreset[] {
  return indieGamePresets.filter((p) => p.category === category);
}
