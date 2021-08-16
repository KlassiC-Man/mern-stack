const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const User = require("../../models/Users");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

// /api/profile route!!!
router.get("/me", auth, async function (req, res) {
    try {
        setTimeout(() => {
            console.log("Hello, World!");
        }, 3000);
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            "user",
            ["name", "avatar"]
        );
        if (!profile) {
            return res.status(400).json({ error: "No Profile for this user!" });
        }
        res.json(profile);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error!");
    }
});

// Create or update a user profile
router.post(
    "/",
    [
        auth,
        [
            check("status", "Status is required").not().isEmpty(),
            check("skills", "Skills are required").not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            instagram,
            twitter,
            github,
            linkedin,
            facebook,
            pinterest,
        } = req.body;

        // Build the profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills
                .split(",")
                .map((skill) => skill.trim());
        }

        //Build the social object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (instagram) profileFields.social.instagram = instagram;
        if (facebook) profileFields.social.facebook = facebook;
        if (github) profileFields.social.github = github;
        if (pinterest) profileFields.social.pinterest = pinterest;
        if (linkedin) profileFields.social.linkedin = linkedin;

        try {
            let profile = await Profile.findOne({ user: req.body.user });
            if (profile) {
                profile = await profile.findOneAndUpdate(
                    { user: req.body.user },
                    { $set: profileFields },
                    { new: true }
                );
                return res.json(profile);
            } else if (!profile) {
                profile = new Profile(profileFields);
                await profile.save();
                return res.json(profile);
            }
        } catch (e) {
            console.error(e);
            res.status(500).json("Internal Server Error");
        }
    }
);

router.get("/", async function (req, res) {
    try {
        const profiles = await Profile.find().populate("user", [
            "name",
            "avatar",
        ]);
        res.json(profiles);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error!");
    }
});

router.get("/user/:user_id", async function (req, res) {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id,
        }).populate("user", ["name", "avatar"]);
        if (!profile) {
            return res
                .status(400)
                .json({ msg: "There is no profile with this id" });
        }
        res.json(profile);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error!");
    }
});

// Delete the profile, user and posts from that user!!
router.delete("/", auth, async function (req, res) {
    try {
        // Remove all the posts by that user!
        await Post.deleteMany({ user: req.user.id });
        // Remove the profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove the user
        await User.findOneAndRemove({ _id: req.user.id });
        // Send the response to the server
        res.send({ msg: "User was removed" });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error!");
    }
});

router.put(
    "/experience",
    [
        auth,
        [
            check("title", "Title is required").not().isEmpty(),
            check("company", "Company is required").not().isEmpty(),
            check("from", "From Date is required").not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, company, location, from, to, current, description } =
            req.body;
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (e) {
            console.error(e);
            res.status(500).send("Internal Server Error!");
        }
    }
);

router.delete("/experience/:exp_id", auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        // Get the index in the array to delete one experience object in the experience array!
        const removeIndex = profile.experience
            .map((exp) => exp.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error!");
    }
});

// Put request for education!!!!
router.put(
    "/education",
    [
        auth,
        [
            check("school", "School is required").not().isEmpty(),
            check("degree", "Degree is required").not().isEmpty(),
            check("fieldofstudy", "A field of study is required")
                .not()
                .isEmpty(),
            check("from", "A from date is required").not().isEmpty(),
        ],
    ],
    async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const { school, degree, fieldofstudy, from, to, current, description } =
            req.body;
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.education.unshift(newEdu);
            profile.save();
            res.json(profile);
        } catch (e) {
            console.error(e);
            res.status(500).send("Internal Server Error!");
        }
    }
);

router.delete("/education/:edu_id", auth, async function (req, res) {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education
            .map((edu) => edu.id)
            .indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error!");
    }
});

router.get("/github/:username", async function (req, res) {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                "githubClientId"
            )}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: { "user-agent": "node.js" },
        };
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                return res
                    .status(400)
                    .json({ error: "No github profile found!" });
            }
            res.json(JSON.parse(body));
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
